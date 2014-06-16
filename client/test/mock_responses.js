// GET /api/v1/cars
exports.cars = [
   {
      "id":10,
      "vin":"0",
      "spz":"2SV4407",
      "model_id":152,
      "model_year":2014,
      "name":"V40 D2 CROSS COUNTRY",
      "engine_displacement":0,
      "transmission":"MANUAL",
      "color":"",
      "equipment":3,
      "model_name":"V40 CC"
   },
   {
      "id":9,
      "vin":"0",
      "spz":"3SA9637",
      "model_id":153,
      "model_year":2014,
      "name":"S80 D5 AWD",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"S80"
   },
   {
      "id":11,
      "vin":"0",
      "spz":"2SY1290",
      "model_id":154,
      "model_year":2014,
      "name":"V60 D4 DRIVE -E",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"V60"
   },
   {
      "id":12,
      "vin":"0",
      "spz":"3SA8339",
      "model_id":155,
      "model_year":2014,
      "name":"S60 D4 DRIVE -E",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"S60"
   },
   {
      "id":8,
      "vin":"0",
      "spz":"3SD3488",
      "model_id":156,
      "model_year":2014,
      "name":"XC70 D4 DRIVE -E",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"XC70"
   },
   {
      "id":13,
      "vin":"0",
      "spz":"2SY1661",
      "model_id":156,
      "model_year":2014,
      "name":"XC70 D5 AWD",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"XC70"
   },
   {
      "id":14,
      "vin":"0",
      "spz":"XXXXXXX",
      "model_id":157,
      "model_year":2014,
      "name":"XC60 D4 DRIVE - E",
      "engine_displacement":0,
      "transmission":"AUTO",
      "color":"",
      "equipment":3,
      "model_name":"XC60"
   }
];


// GET /api/v1/reservations
exports.reservations = [
   {
      "id":60,
      "customer_id":44,
      "car_id":10,
      "start":"2014-6-7",
      "end":"2014-6-24",
      "reason":1,
      "note":null,
      "created_at":"2014-06-07T16:07:19.000Z",
      "created_by":1,
      "updated_at":"2014-06-07T16:07:19.000Z"
   },
   {
      "id":61,
      "customer_id":44,
      "car_id":9,
      "start":"2014-6-7",
      "end":"2014-6-24",
      "reason":1,
      "note":null,
      "created_at":"2014-06-07T16:07:19.000Z",
      "created_by":1,
      "updated_at":"2014-06-07T16:07:19.000Z"
   },
   {
      "id":62,
      "customer_id":44,
      "car_id":9,
      "start":"2014-6-25",
      "end":"2014-6-26",
      "reason":1,
      "note":null,
      "created_at":"2014-06-07T16:07:19.000Z",
      "created_by":1,
      "updated_at":"2014-06-07T16:07:19.000Z"
   }
];
