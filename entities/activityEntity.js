
module.exports = {
  id : {
    type: "float"
  },
  name : {
    type: "text"
  },
  distance : {
    type: "integer"
  },
  moving_time : {
    type: "integer"
  },
  elapsed_time:{
    type:"integer"
  },
  elevation: {
    type: "float"
  },
  type : {
    type: "text"
  },
  start_date_local : {
    type:"datetime",
    format: "YYYY-MM-DD HH:mm:ssZ"
  },      
  start_latlng: {
    type: "text"
  },
  end_latlng: {
    type: "text"
  },
  location_city: {
    type: "text"
  },
	location_country : {
    type: "text"
  },
  avarage_speed : {
    type: "float"
  },
  max_speed : {
    type: "float"
  },
  kudos : {
    type: "integer"
  }
};