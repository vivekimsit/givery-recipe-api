const express = require("express");

const app = express();
app.use(express.json());

let recipes = [];
let nextId = 1;

function hasRequiredFields(body) {
	return ["title", "making_time", "serves", "ingredients", "cost"].every(
		function everyField(field) {
			return body[field];
		},
	);
}

app.get("/", function rootHandler(req, res) {
	res.status(200).json({
		message: "ok",
	});
});

app.post("/recipes", function createRecipeHandler(req, res) {
	if (!hasRequiredFields(req.body)) {
		return res.status(200).json({
			message: "Recipe creation failed!",
			required: "title, making_time, serves, ingredients, cost",
		});
	}

	const now = new Date().toISOString().slice(0, 19).replace("T", " ");
	const recipe = {
		id: nextId++,
		title: req.body.title,
		making_time: req.body.making_time,
		serves: req.body.serves,
		ingredients: req.body.ingredients,
		cost: req.body.cost,
		created_at: now,
		updated_at: now,
	};

	recipes.push(recipe);

	return res.status(200).json({
		message: "Recipe successfully created!",
		recipe: [recipe],
	});
});

app.get("/recipes", function listRecipesHandler(req, res) {
	return res.status(200).json({
		recipes: recipes,
	});
});

app.get("/recipes/:id", function getRecipeHandler(req, res) {
	const recipeId = Number(req.params.id);
	const recipe = recipes.find(function findRecipe(item) {
		return item.id === recipeId;
	});

	return res.status(200).json({
		message: "Recipe details by id",
		recipe: recipe ? [recipe] : [],
	});
});

app.patch("/recipes/:id", function updateRecipeHandler(req, res) {
	const recipeId = Number(req.params.id);
	const recipe = recipes.find(function findRecipe(item) {
		return item.id === recipeId;
	});

	if (!recipe) {
		return res.status(200).json({
			message: "Recipe successfully updated!",
			recipe: [],
		});
	}

	const updates = ["title", "making_time", "serves", "ingredients", "cost"];
	for (const field of updates) {
		if (req.body[field] !== undefined) {
			recipe[field] = req.body[field];
		}
	}

	recipe.updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");

	return res.status(200).json({
		message: "Recipe successfully updated!",
		recipe: [recipe],
	});
});

app.delete("/recipes/:id", function deleteRecipeHandler(req, res) {
	const recipeId = Number(req.params.id);
	const recipeIndex = recipes.findIndex(function findRecipeIndex(item) {
		return item.id === recipeId;
	});

	if (recipeIndex === -1) {
		return res.status(200).json({
			message: "No recipe found",
		});
	}

	recipes.splice(recipeIndex, 1);

	return res.status(200).json({
		message: "Recipe successfully removed!",
	});
});

app.use(function notFoundHandler(req, res) {
	return res.status(404).json({});
});

app.listen(process.env.PORT || 3000, function onListen() {
	console.log("Server running on port", process.env.PORT || 3000);
});
