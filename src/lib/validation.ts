/* ──────────────────────────────────────────────
   CookMate AI — Client Form Validation Schemas & Helpers
   Structured field-level validation
   ────────────────────────────────────────────── */

export interface ValidationErrors {
  [key: string]: string | undefined;
}

/**
 * Validates email string format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Login Form
 */
export function validateLoginForm(data: { email?: string; password?: string }): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  return errors;
}

/**
 * Validate Register Form
 */
export function validateRegisterForm(data: {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name?.trim()) {
    errors.name = "Full name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

/**
 * Validate Recipe Form
 */
export function validateRecipeForm(data: {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  cookingTime?: string | number;
  servings?: string | number;
  ingredients?: { name: string; qty: string; unit: string }[];
  instructions?: string[];
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.title?.trim()) {
    errors.title = "Recipe title is required";
  } else if (data.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (!data.shortDescription?.trim()) {
    errors.shortDescription = "Short description is required";
  }

  if (!data.fullDescription?.trim()) {
    errors.fullDescription = "Full description is required";
  }

  const timeNum = Number(data.cookingTime);
  if (!data.cookingTime || isNaN(timeNum) || timeNum <= 0) {
    errors.cookingTime = "Cooking time must be greater than 0 minutes";
  }

  const servingsNum = Number(data.servings);
  if (!data.servings || isNaN(servingsNum) || servingsNum <= 0) {
    errors.servings = "Servings must be at least 1";
  }

  const validIngredients = data.ingredients?.filter((i) => i.name.trim()) || [];
  if (validIngredients.length === 0) {
    errors.ingredients = "At least one ingredient is required";
  }

  const validInstructions = data.instructions?.filter((s) => s.trim()) || [];
  if (validInstructions.length === 0) {
    errors.instructions = "At least one instruction step is required";
  }

  return errors;
}

/**
 * Validate Contact Form
 */
export function validateContactForm(data: {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name?.trim()) errors.name = "Name is required";
  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Invalid email address";
  }
  if (!data.subject?.trim()) errors.subject = "Subject is required";
  if (!data.message?.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
}
