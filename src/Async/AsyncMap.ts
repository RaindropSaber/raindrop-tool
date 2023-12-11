const asyncMap = (list, fn) =>
  list.reduce(
    (_, v, i, a) =>
      _.then((resList) =>
        fn(v, i, a)
          .then((res) => resList.push(res))
          .then(() => resList)
      ),
    Promise.resolve([])
  );