function createExceptionHandler(track) {
  return function TrackingExceptionHandler(exception) {
    track.error(exception.message || exception.toString(), exception.stack);
    console.error(exception);
  };
}

createExceptionHandler.$inject = ['analytics'];
module.exports = createExceptionHandler;
