import { stream, merge$, isStream } from "./";

// provide easy switched on boolean streams
// example use case: <button onclick={()=>open$(!open$())}>{if$(open$, 'Close', 'Open')}</button>
export function if$(boolean$, onTrue = null, onFalse = null) {
  if (boolean$ === undefined || !isStream(boolean$)) {
    return stream(boolean$ ? onTrue : onFalse);
  }
  return boolean$.map(x => (x ? onTrue : onFalse));
}

// join a mixed array of strings and streams of strings
// example use case: <div class={join$('container', if$(open$, 'open', 'closed'))} />
export function join$(...$arr) {
  return merge$($arr).map(arr => arr.join(" "));
}

/*
* Resolve all nested streams in an object
* input: {a:{}, b:stream:{}}
* output: stream({a:{}, b:{}})
*/
export function resolve$(obj) {
  if (obj === null) return stream({});

  let nestedStreams = extractNestedStreams(obj);
  let updateStreams = nestedStreams.map(function makeNestedStreamUpdateObject({
    parent,
    key,
    stream
  }) {
    return (
      stream
        .distinct()
        // here we produce a sideeffect on the object -> low GC
        // to trigger the merge we also need to return sth (as undefined does not trigger listeners)
        .map(value => {
          parent[key] = value;
          return value;
        })
    );
  });
  return merge$(updateStreams).map(_ => obj);
}

// to react to nested streams in an object, we extract the streams and a reference to their position
// returns [{parentObject, propertyName, stream}]
function extractNestedStreams(obj) {
  return flatten(
    Object.keys(obj).map(key => {
      // DEPRECATED I can't think of a usecase
      // if (typeof obj[key] === 'object') {
      // 	return extractNestedStreams(obj[key]);
      // }
      if (obj[key] === null || obj[key] === undefined) {
        return [];
      }
      if (isStream(obj[key])) {
        return [
          {
            parent: obj,
            key,
            stream: obj[key]
          }
        ];
      }
      if (typeof obj[key] === "object") {
        return extractNestedStreams(obj[key]);
      }
      return [];
    })
  );
}

// flattens an array
export function flatten(array, mutable) {
  var toString = Object.prototype.toString;
  var arrayTypeStr = "[object Array]";

  var result = [];
  var nodes = (mutable && array) || array.slice();
  var node;

  if (!array.length) {
    return result;
  }

  node = nodes.pop();

  do {
    if (toString.call(node) === arrayTypeStr) {
      nodes.push.apply(nodes, node);
    } else {
      result.push(node);
    }
  } while (nodes.length && (node = nodes.pop()) !== undefined);

  result.reverse(); // we reverse result to restore the original order
  return result;
}
