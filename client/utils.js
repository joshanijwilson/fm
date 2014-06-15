function isCarAvailable(reservations, startDate, endDate) {
  if (!reservations || !reservations.length) {
    return true;
  }

  for (var i = 0; i < reservations.length; i++) {
    if (reservations[i].end < startDate) {
      // This reservation is before the requested interval.
      continue;
    }

    if (endDate < reservations[i].start) {
      // This reservation is after the requested interval.
      // Because the reservations are sorted, we can end the loop.
      return true;
    }

    return false;
  }

  return true;
}

exports.isCarAvailable = isCarAvailable;
