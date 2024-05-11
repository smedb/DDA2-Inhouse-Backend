const ML_MODEL_VARIABLES = [
    {
        key: "immovables",
        options: ["0", "1-2", ">2"]
    },
    {
        key: "monthly_income",
        options: ["<500", "<1000", ">1000"]
    },
    {
        key: "employment_situation",
        options: ["employee", "self-employed", "unemployed"]
    },
    {
        key: "has_tesla",
        options: ["no", "yes"]
    }
];

module.exports = { ML_MODEL_VARIABLES };