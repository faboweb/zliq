import deepEqual from "deep-equal";

/*
* stream constructor
* constructor returns a stream
* get the current value of stream like: stream.value
*/
export const stream = function(init_value) {
  let s = function(value) {
    if (value === undefined) {
      return s.value;
    }
    update(s, value);
    return s;
  };

  s.IS_STREAM = true;
  s.value = init_value;
  s.listeners = [];

  // better debugging output for streams
  s.toString = () => "Stream(" + s.value + ")";

  s.map = fn => map(s, fn);
  s.is = value => map(s, cur => cur === value);
  s.flatMap = fn => flatMap(s, fn);
  s.filter = fn => filter(s, fn);
  s.deepSelect = fn => deepSelect(s, fn);
  s.distinct = fn => distinct(s, fn);
  s.query = selectorArr => query(s, selectorArr);
  s.$ = selectorArr => query(s, selectorArr).distinct();
  s.until = stopEmit$ => until(s, stopEmit$);
  s.patch = partialChange => patch(s, partialChange);
  s.reduce = (fn, startValue) => reduce(s, fn, startValue);
  s.debounce = timer => debounce(s, timer);
  s.schedule = (scheduleItems, onDone) => schedule(s, scheduleItems, onDone);
  s.next = () => next(s);
  s.log = (prefix = "Stream:") => log(s, prefix);

  return s;
};

/*
* wrapper for the diffing of stream values
*/
function valuesChanged(oldValue, newValue) {
  return !deepEqual(oldValue, newValue);
}

/*
* update the stream value and notify listeners on the stream
*/
function update(parent$, newValue) {
  parent$.value = newValue;
  notifyListeners(parent$.listeners, newValue);
}

/*
* provide a new value to all listeners registered for a stream
*/
function notifyListeners(listeners, value) {
  listeners.forEach(function notifyListener(listener) {
    listener(value);
  });
}

/*
* Do not pipe the value undefined. This allows to wait for an external initialization.
* It also saves you from checking for an initial null on every map function.
*/
function fork$(parent$, mapFunction) {
  let initValue =
    parent$.value !== undefined ? mapFunction(parent$.value) : undefined;
  return stream(initValue);
}

/*
* provides a new stream applying a transformation function to the value of a parent stream
*/
function map(parent$, fn) {
  let newStream = fork$(parent$, fn);
  parent$.listeners.push(function mapValue(value) {
    newStream(fn(value));
  });
  return newStream;
}

/* 
* helper function to debug, calls console.log on every value returnin the parent stream 
*/
function log(parent$, prefix) {
  map(parent$, value => console.log(prefix, value));
  return parent$;
}

/*
* provides a new stream applying a transformation function to the value of a parent stream
*/
function flatMap(parent$, fn) {
  let result$;
  let listener = function updateOuterStream(result) {
    newStream(result);
  };
  function attachToResult$(mapFn, parentValue, listener) {
    let result$ = mapFn(parentValue);
    result$.listeners.push(listener);
    return result$;
  }
  let newStream = fork$(parent$, function getChildStreamValue(value) {
    result$ = attachToResult$(fn, value, listener);
    return result$.value;
  });
  parent$.listeners.push(function flatMapValue(value) {
    // clean up listeners or they will stack on child streams
    if (result$) {
      removeItem(result$.listeners, listener);
    }

    result$ = attachToResult$(fn, value, listener);
    newStream(result$.value);
  });
  return newStream;
}

/*
* provides a new stream that only serves the values that a filter function returns true for
* still a stream ALWAYS has a value -> so it starts at least with NULL
*/
function filter(parent$, fn) {
  let newStream = fork$(parent$, value => (fn(value) ? value : undefined));
  parent$.listeners.push(function filterValue(value) {
    if (fn(value)) {
      newStream(value);
    }
  });
  return newStream;
}

/*
* recursivly return the nested property of an object defined by an array of selectors
* parent: {foo: {bar:1}}, selectors: ['foo','bar'] returns 1
*/
function select(parent, selectors) {
  if (parent === null || parent === undefined) {
    return null;
  }
  if (selectors.length === 0) {
    return parent;
  }
  let selector = selectors[0];
  return select(parent[selector], selectors.splice(1, selectors.length - 1));
}
/*
* provides a new stream that has a selected sub property of the object value of the parent stream
* the selector has the format [{propertyName}.]*
*/
function deepSelect(parent$, selector) {
  let selectors = selector.split(".");

  let newStream = fork$(parent$, value => select(value, selectors));
  parent$.listeners.push(function deepSelectValue(newValue) {
    newStream(select(newValue, selectors));
  });
  return newStream;
}

function query(parent$, selectorsArr) {
  if (!Array.isArray(selectorsArr)) {
    return parent$.map(value => select(value, selectorsArr.split(".")));
  }
  return parent$.map(value =>
    selectorsArr.map(selectors => select(value, selectors.split(".")))
  );
}

// TODO: maybe refactor with filter
/*
* provide a new stream that only notifys its children if the containing value actualy changes
*/
function distinct(parent$, fn = (a, b) => valuesChanged(a, b)) {
  let newStream = fork$(parent$, value => value);
  parent$.listeners.push(function deepSelectValue(value) {
    if (fn(newStream.value, value)) {
      newStream(value);
    }
  });
  return newStream;
}

/*
* update only the properties of an object passed
* i.e. {name: 'Fabian', lastname: 'Weber} patched with {name: 'Fabo'} produces {name: 'Fabo', lastname: 'Weber}
*/
function patch(parent$, partialChange) {
  setImmediate(() => {
    if (
      partialChange === null ||
      typeof partialChange !== "object" ||
      typeof parent$.value !== "object"
    ) {
      parent$(partialChange);
    } else {
      parent$(Object.assign({}, parent$.value, partialChange));
    }
  });
  return parent$;
}

function until(parent$, stopEmitValues$) {
  let newStream = stream();
  let subscribeTo = (stream, listener) => {
    listener(parent$.value);
    stream.listeners.push(listener);
  };
  if (stopEmitValues$.value === undefined) {
    subscribeTo(parent$, newStream);
  }
  stopEmitValues$.map(stopEmitValues => {
    if (stopEmitValues) {
      removeItem(parent$.listeners, newStream);
    } else {
      subscribeTo(parent$, newStream);
    }
  });
  return newStream;
}

/*
* reduce a stream over time
* this will pass the last output value to the calculation function
* reads like the array reduce function
*/
function reduce(parent$, fn, startValue) {
  let aggregate = startValue;
  let newStream = stream();
  function reduceValue(value) {
    aggregate = fn(aggregate, parent$.value);
    newStream(aggregate);
  }
  if (parent$.value !== undefined) {
    reduceValue(parent$.value);
  }
  parent$.listeners.push(reduceValue);
  return newStream;
}

function debounce(parent$, timer) {
  let curTimer;
  function debounceValue(value) {
    if (curTimer) {
      window.clearTimeout(curTimer);
    }
    curTimer = setTimeout(function updateChildStream() {
      newStream(value);
      curTimer = null;
    }, timer);
  }
  let newStream = stream();
  if (parent$.value !== undefined) {
    debounceValue(parent$.value);
  }
  parent$.listeners.push(debounceValue);
  return newStream;
}

/*
* Execute the scheduled function or return the scheduled value for a stream iteration
*/
function executeScheduleItem(schedule, iteration, value) {
  if (schedule.length < iteration + 1) {
    throw Error("ZLIQ: schedule for iteration " + iteration + " not defined");
  }
  let item = schedule[iteration];
  if (typeof item === "function") {
    return item(value);
  } else {
    return item;
  }
}

/*
* Especially in tests you want to define a reaction to a certain iteration of a stream
* The iteration can be a function or a value
*/
function schedule(parent$, schedule, onDone = () => {}) {
  let iteration = 0;
  let newStream = fork$(parent$, value =>
    executeScheduleItem(schedule, iteration++, value)
  );
  if (schedule.length === iteration) onDone();

  parent$.listeners.push(function checkSchedule(value) {
    // do immediate to prevent schedule items to update parent streams before child streams ran
    setImmediate(() => {
      newStream(executeScheduleItem(schedule, iteration++, value));
      if (iteration === schedule.length) onDone();
    });
  });
  return newStream;
}

/*
*  allow to use a stream in an async await cycle
* i.e: const value = await myStream.next()
*/
function next(parent$) {
  let resolve;
  const promise = new Promise(_resolve => {
    resolve = _resolve;
  });
  subscribeTo(parent$, resolve);
  promise.then(() => removeItem(parent$.listeners, resolve));
  return promise;
}

/*
* merge several streams into one stream providing the values of all streams as an array
* accepts also non stream elements, those are just copied to the output
* the merge will only have a value if every stream for the merge has a value
*/
export function merge$(potentialStreamsArr) {
  let values = potentialStreamsArr.map(
    parent$ => (parent$ && parent$.IS_STREAM ? parent$.value : parent$)
  );
  let newStream = stream(values.indexOf(undefined) === -1 ? values : undefined);

  potentialStreamsArr.forEach((potentialStream, index) => {
    if (potentialStream.IS_STREAM) {
      potentialStream.listeners.push(function updateMergedStream(value) {
        values[index] = value;
        newStream(values.indexOf(undefined) === -1 ? values : undefined);
      });
    }
  });
  return newStream;
}

export function isStream(parent$) {
  return parent$ != null && !!parent$.IS_STREAM;
}

function removeItem(arr, item) {
  var index = arr.indexOf(item);
  if (index !== -1) {
    arr.splice(index, 1);
  }
}
