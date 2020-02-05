function generateUuid() {
  return (
    Date.now()
      .toString()
      .substring(4, 13) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

export default generateUuid;
