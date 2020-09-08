function sphericalDistance(latitude1, longtitude1, latitude2, longtitude2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((latitude2 - latitude1) * p) / 2 + c(latitude1 * p) * c(latitude2 * p) * (1 - c((longtitude2 - longtitude1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}