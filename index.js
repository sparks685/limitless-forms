import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// In-memory storage
// formId -> array of submissions
const forms = new Map();

/**
 * Health check / homepage
 */
app.get("/", (req, res) => {
  res.send("Limitless Forms API is running 🚀");
});

/**
 * POST /submit/:formId
 * Save a form submission
 */
app.post("/submit/:formId", (req, res) => {
  const { formId } = req.params;
  const submission = {
    ...req.body,
    submittedAt: new Date().toISOString(),
  };

  if (!forms.has(formId)) {
    forms.set(formId, []);
  }

  forms.get(formId).push(submission);

  const redirectUrl = req.query.redirect;

if (redirectUrl) {
  return res.redirect(302, redirectUrl);
}

res.status(201).json({
  success: true,
  formId,
  submission,
});
});

/**
 * GET /responses/:formId
 * Retrieve all submissions for a form
 */
app.get("/responses/:formId", (req, res) => {
  const { formId } = req.params;

  const responses = forms.get(formId) || [];

  res.json({
    formId,
    count: responses.length,
    responses,
  });
});

app.listen(PORT, () => {
  console.log(`Limitless Forms API running on port ${PORT}`);
});
