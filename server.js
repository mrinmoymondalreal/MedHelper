// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require("express");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const getProducts = require("./fetch.js");
const getDetails = require("./fetchv3.js");
const getGovtDetails = require("./govtSearch.js");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

let arr = [];

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 64,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    {
      text: 'input: You are a friendly chatBot named Rahul, You help people with understand the medicine they are taking by explaining them the advantages and side effects and other data provided in simple language. You do not recommend or force people to take any kind of medicine you just help them to under the medicine better also add a line saying "This Information is available publicly on the Internet and please refer to a doctor before taking any kind of medicine"',
    },
    { text: "output: " },
    {
      text: "input: \"Product DetailsAbout Prazopress XL 5 Tablet 30'sPrazopress XL 5 Tablet 30's contains an 'anti-hypertensive' medication primarily used to treat hypertension (high blood pressure) and lower any future risk of heart attack and stroke. In addition to this, it is also used to treat mild prostate gland enlargement in men (known as Benign Prostate Hyperplasia) and treating heart failure. Hypertension (high blood pressure) is a lifelong or chronic condition in which the blood pressure against the artery walls becomes high. The higher this blood pressure, the harder the heart has to pump. Prazopress XL 5 Tablet 30's contains Prazosin, an alpha-blocker, primarily used to treat hypertension (high blood pressure). It acts by relaxing the blood vessels, reducing the heart's workload, and making the heart more efficient at pumping blood throughout the body. Thus, it helps to lower high blood pressure, reducing the chances of any future heart attack or stroke.Take Prazopress XL 5 Tablet 30's as prescribed by your doctor. You are advised to take Prazopress XL 5 Tablet 30's for as long as your doctor has prescribed it for you, depending upon your medical condition. The most common side effects of Prazopress XL 5 Tablet 30's are drowsiness, headache, weakness, dizziness, priapism (prolonged erections), nausea, and feeling exhausted. They do not require medical attention and gradually resolve over time. However, if the side effects are persistent, reach out to your doctor. It is advisable to drink plenty of fluids while taking this medicine. Lifestyle changes are beneficial in achieving optimum outcomes with Prazopress XL 5 Tablet 30's and keeping blood pressure under check. A low salt diet, daily physical activity (even 20-30 minute brisk walking for 5 days a week can help, losing weight in case of people who are obese), etc., are the mainstay of treatment of hypertension. Inform your doctor if you have had an allergic reaction to Prazopress XL 5 Tablet 30's, are pregnant or are planning to get pregnant, are breastfeeding, have liver disease, kidney disease, heart failure, a heart valve problem, or a history of a heart attack.Uses of Prazopress XL 5 Tablet 30'sTreatment of High blood pressure (hypertension), Prevention of heart attack, Benign Prostate Hyperplasia, Cold Finger Syndrome (Raynaud's disease)Medicinal BenefitsPrazopress XL 5 Tablet 30's is primarily used to treat hypertension (high blood pressure) and lower the risk of future heart attack and stroke. It is also used to treat mild prostate gland enlargement in men (known as Benign Prostate Hyperplasia) and treating heart failure. Prazopress XL 5 Tablet 30's contains Prazosin, an alpha-blocker that acts by widening and relaxing the blood vessels, reducing the heart's workload, and making the heart more efficient at pumping blood throughout the body. Thus, it reduces high blood pressure and reduces the chances of a future heart attack or stroke.Directions for UseTake Prazopress XL 5 Tablet 30's with or without food as advised by your doctor. Swallow it as a whole with a glass of water. Do not crush, chew, or break it.StorageStore in a cool and dry place away from sunlightSide Effects of Prazopress XL 5 Tablet 30'sDrowsinessHeadacheLack of energy, weaknessDizzinessPalpitationsLightheadednessPriapism (prolonged erections)NauseaFeeling exhausted\",\n    \"In-depth InformationDrug WarningsPrazopress XL 5 Tablet 30's should not be given to the people allergic to Prazopress XL 5 Tablet 30's, have low blood pressure (less than 90 mm of Hg), have had a heart attack, kidney disease, liver disease, pregnant women or planning to get pregnant and breastfeeding women without the prescription of a doctor. Besides this, it is contraindicated in patients with aortic stenosis (heart valve problem). Prazopress XL 5 Tablet 30's can pass into breast milk, but its effect on the baby is not known. So, it is better to tell your doctor if you are taking Prazopress XL 5 Tablet 30's and breastfeeding. As with all alpha-blockers (blood pressure-lowering pills), Prazopress XL 5 Tablet 30's may cause sudden loss of consciousness due to a sudden dip in the blood pressure with heart rates of 120–160 beats per minute. Low blood pressure (hypotension) may develop in patients given Prazopress XL 5 Tablet 30's who are also receiving a beta-blocker (blood pressure-lowering pills) such as propranolol. Dizziness, light-headedness, or fainting may occur, especially when rising from a lying or sitting position due to postural hypotension. Getting up slowly may help lessen the problem. During cataract surgery, an eye problem known as Intraoperative Floppy Iris Syndrome (IFIS) has been associated with alpha-1 blocker therapy (blood pressure-lowering pills). If you are undergoing any planned eye surgery, let your doctor know that you are taking Prazopress XL 5 Tablet 30's.Drug InteractionsDrug-Drug Interaction: Prazopress XL 5 Tablet 30's may interact with high blood pressure lowering pills (benazepril, metoprolol, ramipril, hydrochlorothiazide), drugs used to control lipid levels in the blood (atorvastatin, simvastatin), medicines to treat erectile dysfunction (sildenafil), antibiotics (clarithromycin, erythromycin, rifampin), antifungal (itraconazole, ketoconazole), anti-HIV drugs (ritonavir), anti-epilepsy medicines (carbamazepine, phenytoin, phenobarbital, primidone), immune-suppressing drugs (cyclosporine, tacrolimus) and painkillers (ibuprofen, aspirin).Drug-Food Interaction: Avoid foods with high fat or cholesterol. Avoid too much salt in your diet like pickles, extra salt on salad, etc.Drug-Disease Interaction: Prazopress XL 5 Tablet 30's should not be given to people with cardiogenic shock (when the heart fails to pump required blood to the body), heart valve problem (stenosis), low blood pressure (hypotension), liver disease or heart failure.Drug-Drug Interactions Checker ListBENAZEPRILMETOPROLOLRAMIPRILHYDROCHLOROTHIAZIDEATORVASTATINSIMVASTATINSILDENAFILCLARITHROMYCINERYTHROMYCINRIFAMPICINITRACONAZOLEKETOCONAZOLERITONAVIRCARBAMAZEPINEPHENYTOINPHENOBARBITALPRIMIDONECYCLOSPORINETACROLIMUSIBUPROFENASPIRINHabit FormingNoDiet & Lifestyle AdviseKeep your weight under control with a BMI of 19.5-24.9.Do regular physical activity or exercise for at least 150 minutes per week, or about 30 minutes most days of the week. Doing this can help you to lower your raised blood pressure by about 5 mm of Hg.Opt for a diet rich in whole grains, fruits, veggies, and low-fat dairy products.Limit intake of sodium chloride (table salt) in your daily diet to 2300 mg per day or less than 1500 mg is ideal for most adults.If you are taking alcohol, then only one serving for women and two servings for men is advisable.Quitting smoking is the best strategy to lower the risk of heart disease.Avoid chronic stress as it can raise your blood pressure. Try to enjoy and spent time with your loved ones to cope with stress and practice mindfulness techniques.Monitor your blood pressure daily and if there is too much fluctuation, then immediately contact your doctor.Try to include heart-healthy omega 3 fatty acid-containing food drinks in your daily diet. You can also use low-fat cooking oil like olive oil, soybean oil, canola oil, and coconut oil to lower your elevated blood pressure.Special AdviseConsumption of Prazopress XL 5 Tablet 30's may cause dizziness. Avoid activities like driving while on this medication.A sudden drop in blood pressure may be seen while on this medication, leading to dizziness. Changing your posture at a slower rate might help counter this. Ankle swelling, which can be a sign of oedema, can be experienced as a side effect of this drug. Consult your doctor if this or other side effects cause trouble or are persistent.\",\n    \"Patients ConcernDisease/Condition GlossaryHypertension: Blood pressure is the measurement of the force that our heart uses to pump blood to all body parts. Hypertension is a chronic condition when blood pressure is too high. This condition can lead to hardened arteries (blood vessels), decreasing the blood and oxygen flow to the heart. Raised blood pressure can cause chest pain (angina) and heart attack (when blood supply to the heart is blocked). Additionally, high blood pressure also causes brain damage (stroke) and kidney failure. High blood pressure can be diagnosed with the help of a blood pressure monitor. Blood pressure is determined both by the amount of blood your heart pumps and the amount of resistance to blood flow in your arteries. The more blood your heart pumps and the narrower your arteries, the higher your blood pressure.  Even without symptoms, damage to blood vessels and your heart continues and can be detected.Benign prostatic hyperplasia (BPH): It is the enlargement of the prostate gland. It is a non-cancerous growth of the prostate gland caused due to overproduction of dihydrotestosterone hormone in men. After age 50, most men develop an enlarged prostate gland putting pressure on the urinary bladder. It leads to restricted or obstructed urine flow, the urge to urinate frequently (especially at night), and the feeling of not emptying the urinary bladder.  Raynaud's disease: Also known as cold finger syndrome it causes smaller arteries that supply blood flow to the skin to narrow in response to cold or stress. The affected body parts, especially fingers and toes, might turn white or blue with a cold feeling and numbness until circulation improves, usually when you get warm. \"\n\n\nAlternatives :- \n[\n  {\n    id: 37169,\n    sku: 'REN0106',\n    name: \"Renopress-XL-5 Tablet 10's\",\n    urlKey: 'renopress-xl-5mg-tablet',\n    thumbnail: '/catalog/product/R/E/REN0106_1_1.jpg',\n    category: null,\n    subCategory: 'Cardiology',\n    brand: null,\n    type: 'product',\n    merchandisingText: null,\n    status: 'in-stock',\n    moq: 1,\n    maxOrderQty: 10,\n    suggestedQty: 3,\n    unitSize: '10',\n    flags: [ 'SHOW_ALTERNATES' ],\n    isPrescriptionRequired: 1,\n    tags: null,\n    multiVariantsProducts: null,\n    price: 127,\n    specialPrice: 111.8,\n    discountPercentage: 12,\n    circleCashback: null,\n    transaction: null,\n    tat: -1,\n    deliveryTime: null\n  },\n  {\n    id: 74647,\n    sku: 'PRA0323',\n    name: \"Prazoren-Xl 5mg Tablet 10's\",\n    urlKey: 'prazoren-xl-5mg-tablet-10-s',\n    thumbnail: '/catalog/product/p/r/pra0323.jpg',\n    category: null,\n    subCategory: 'Cardiology',\n    brand: 'AYUR',\n    type: 'product',\n    merchandisingText: null,\n    status: 'in-stock',\n    moq: 1,\n    maxOrderQty: 10,\n    suggestedQty: 3,\n    unitSize: '10',\n    flags: [ 'SHOW_ALTERNATES' ],\n    isPrescriptionRequired: 1,\n    tags: null,\n    multiVariantsProducts: null,\n    price: 139,\n    specialPrice: 122.3,\n    discountPercentage: 12,\n    circleCashback: null,\n    transaction: null,\n    tat: -1,\n    deliveryTime: null\n  },\n  {\n    id: 64138,\n    sku: 'PRO1509',\n    name: \"Prozoten 5 Mg Xl Tablet 10's\",\n    urlKey: 'prozoten-5-mg-xl-tablet-10-s',\n    thumbnail: '/catalog/product/P/R/PRO1509_1.jpg',\n    category: null,\n    subCategory: 'Cardiology',\n    brand: 'AYUR',\n    type: 'product',\n    merchandisingText: null,\n    status: 'in-stock',\n    moq: 1,\n    maxOrderQty: 10,\n    suggestedQty: 3,\n    unitSize: '10',\n    flags: [ 'SHOW_ALTERNATES' ],\n    isPrescriptionRequired: 1,\n    tags: null,\n    multiVariantsProducts: null,\n    price: 124,\n    specialPrice: 109.12,\n    discountPercentage: 12,\n    circleCashback: null,\n    transaction: null,\n    tat: -1,\n    deliveryTime: null\n  },\n  {\n    id: 62342,\n    sku: 'PRA0326',\n    name: \"Prazopill XL 5 Tablet 30's\",\n    urlKey: 'prazopill-xl-5mg-tablet-30s',\n    thumbnail: '/catalog/product/p/r/pra0326.jpg',\n    category: null,\n    subCategory: 'Cardiology',\n    brand: null,\n    type: 'product',\n    merchandisingText: null,\n    status: 'in-stock',\n    moq: 1,\n    maxOrderQty: 10,\n    suggestedQty: 1,\n    unitSize: '30',\n    flags: [ 'SHOW_ALTERNATES' ],\n    isPrescriptionRequired: 1,\n    tags: null,\n    multiVariantsProducts: null,\n    price: 404,\n    specialPrice: 355.52,\n    discountPercentage: 12,\n    circleCashback: null,\n    transaction: null,\n    tat: -1,\n    deliveryTime: null\n  },\n  {\n    id: 28016,\n    sku: 'PRA0025',\n    name: \"Prazopress XL 5 Tablet 30's\",\n    urlKey: 'prazopress-xl-5mg-tablet',\n    thumbnail: '/catalog/product/P/R/PRA0025_1_1.jpg',\n    category: null,\n    subCategory: 'Cardiology',\n    brand: null,\n    type: 'product',\n    merchandisingText: null,\n    status: 'in-stock',\n    moq: 1,\n    maxOrderQty: 10,\n    suggestedQty: 4,\n    unitSize: '30',\n    flags: [ 'SHOW_ALTERNATES' ],\n    isPrescriptionRequired: 1,\n    tags: null,\n    multiVariantsProducts: null,\n    price: 525,\n    specialPrice: 462,\n    discountPercentage: 12,\n    circleCashback: null,\n    transaction: null,\n    tat: -1,\n    deliveryTime: null\n  },\n  {\n    id: 34753,\n    sku: 'MIN0272',\n    name: \"Minipress XL 5 mg Tablet 30's\",\n    urlKey: 'minipress-xl-5mg-30s',\n    thumbnail: '/catalog/product/M/I/MIN0272_1.jpg',\n    category: null,\n    subCategory: 'Cardiology',\n    brand: 'AYUR',\n    type: 'product',\n    merchandisingText: null,\n    status: 'in-stock',\n    moq: 1,\n    maxOrderQty: 21,\n    suggestedQty: 1,\n    unitSize: '30',\n    flags: [ 'SHOW_ALTERNATES' ],\n    isPrescriptionRequired: 1,\n    tags: null,\n    multiVariantsProducts: null,\n    price: 626,\n    specialPrice: 550.8399680255795,\n    discountPercentage: 12,\n    circleCashback: null,\n    transaction: null,\n    tat: -1,\n    deliveryTime: null\n  },\n  {\n    id: 34752,\n    sku: 'MIN0271',\n    name: \"Minipress XL 2.5 30's\",\n    urlKey: 'minipress-xl-2-5mg-30s',\n    thumbnail: '/catalog/product/M/I/MIN0271_1_1.jpg',\n    category: null,\n    subCategory: 'Cardiology',\n    brand: null,\n    type: 'product',\n    merchandisingText: null,\n    status: 'in-stock',\n    moq: 1,\n    maxOrderQty: 10,\n    suggestedQty: 1,\n    unitSize: '30',\n    flags: [ 'SHOW_ALTERNATES' ],\n    isPrescriptionRequired: 1,\n    tags: null,\n    multiVariantsProducts: null,\n    price: 502,\n    specialPrice: 441.73998005982054,\n    discountPercentage: 12,\n    circleCashback: null,\n    transaction: null,\n    tat: -1,\n    deliveryTime: null\n  },\n  {\n    id: 8455,\n    sku: 'ARK0002',\n    name: \"Arkamin Tablet 30's\",\n    urlKey: 'arkamin-0-1mg-tablet',\n    thumbnail: '/catalog/product/A/R/ARK0002_1_1.jpg',\n    category: null,\n    subCategory: 'Cardiology',\n    brand: null,\n    type: 'product',\n    merchandisingText: null,\n    status: 'in-stock',\n    moq: 1,\n    maxOrderQty: 20,\n    suggestedQty: 2,\n    unitSize: '30',\n    flags: [ 'SHOW_ALTERNATES' ],\n    isPrescriptionRequired: 1,\n    tags: null,\n    multiVariantsProducts: null,\n    price: 87.5,\n    specialPrice: 77,\n    discountPercentage: 12,\n    circleCashback: null,\n    transaction: null,\n    tat: -1,\n    deliveryTime: null\n  }\n]\n\nwhat are the alternatives of the prazopress",
    },
    { text: "output: " },
    {
      text: `input: "Product DetailsAbout Prazopress XL 5 Tablet 30'sPrazopress XL 5 Tablet 30's contains an 'anti-hypertensive' medication primarily used to treat hypertension (high blood pressure) and lower any future risk of heart attack and stroke. \n what is the name of the medicine`,
    },
    { text: "output: " },
    {
      text: "input: " + userInput,
    },
    { text: "output: " },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  return response.text();
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/select", (req, res) => {
  res.sendFile(__dirname + "/select.html");
});
app.get("/loader.gif", (req, res) => {
  res.sendFile(__dirname + "/loader.gif");
});

app.get("/search", async (req, res) => {
  let q = req.query.name;
  let d1 = await getProducts(q);
  res.send(d1);
});

app.get("/getItem", async (req, res) => {
  try {
    let q = req.query.key;
    let d1 = await getDetails(q);
    let alternatives = await getProducts(
      d1[1].filter((e) => e.key == "composition")[0].value
    );
    arr.push(
      d1[0] +
        "\n" +
        JSON.stringify(d1[1]) +
        "\n" +
        d1[2].join("\n") +
        "\n Alternatives to the medicine or Generic Version of the medicines \n" +
        JSON.stringify(alternatives)
    );
    res.send((arr.length - 1).toString());
  } catch (err) {
    console.log(err);
    res.send(null);
  }
});

app.post("/chat", async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    const id = req.body?.id;
    console.log("incoming /chat req", userInput);
    if (!userInput) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    console.log(arr[parseInt(id) || 0].toString() + "\n");
    const response = await runChat(
      arr[parseInt(id) || 0].toString() +
        "\n" +
        userInput +
        "\n give answer in about 100 words"
    );
    console.log(response);
    res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});