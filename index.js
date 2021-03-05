const Axios = require("axios")
require("now-env")

const { parse } = require("url")
const { send } = require("micro")

module.exports = async (req, res) => {
  const { query } = parse(req.url)
  const { id, dataset, type } = parseQueryString(query)
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Content-Type", "application/json")
  if (query) {
    try {
      const url = `https://${id}.api.sanity.io/v1/data/query/${dataset}?query=*[_type=${type}]`
      const sanityResponse = await Axios.get(url)
      const { data } = await sanityResponse
      const { result } = await data
      send(res, 200, result)
    } catch (err) {
      send(res, 500, err)
    }
  } else {
    send(res, 400, '{"message":"No data provided"}')
  }
}

const parseQueryString = function (queryString) {
  const params = {}
  const queries = queryString.split("&")
  for (let i = 0; i < queries.length; i++) {
    const temp = queries[i].split("=")
    params[temp[0]] = temp[1]
  }
  return params
}
