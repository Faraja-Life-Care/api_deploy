const ConsumptionService = require("./consumption.service");

const router = require("express").Router();

router.get("/all/:value?", async (req, res) => {
  res.status(200).send({
    data: await ConsumptionService.findAll(req.params.value, req.query),
  });
});

router.post("/", async (req, res) => {
  let result = await ConsumptionService.create(req.body);
  res.status(result.status).send(({ data, message } = result));
});

module.exports = router;
