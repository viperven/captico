const Course = require("./models/course");

const data = [
  {
    title: "Wings Of Fire",
    description: "An Autobiography of APJ Abdul Kalam",
    price: "200",
    createdBy: "6787d8d1d138f9ae75d2b9b6",
  },
  {
    title: "The Alchemist",
    description: "A novel by Paulo Coelho about following your dreams.",
    price: "300",
    createdBy: "6787d8d1d138f9ae75d2b9b6",
  },
  {
    title: "To Kill a Mockingbird",
    description:
      "A novel by Harper Lee that addresses serious issues like racial injustice.",
    price: "250",
    createdBy: "6787d8d1d138f9ae75d2b9b6",
  },
  {
    title: "1984",
    description: "A dystopian novel by George Orwell about totalitarianism.",
    price: "220",
    createdBy: "6787d8d1d138f9ae75d2b9b6",
  },
  {
    title: "The Great Gatsby",
    description:
      "A novel by F. Scott Fitzgerald that explores themes of decadence and excess.",
    price: "280",
    createdBy: "6787d8d1d138f9ae75d2b9b6",
  },
  {
    title: "Pride and Prejudice",
    description:
      "A romantic novel by Jane Austen that critiques the British landed gentry.",
    price: "240",
    createdBy: "6787d8d1d138f9ae75d2b9b6",
  },
  {
    title: "The Catcher in the Rye",
    description: "A novel by J.D. Salinger about teenage angst and alienation.",
    price: "260",
    createdBy: "6787d8d1d138f9ae75d2b9b6",
  },
  {
    title: "Moby Dick",
    description:
      "A novel by Herman Melville about the obsessive quest of Ahab for revenge on Moby Dick.",
    price: "300",
    createdBy: "6787d8d1d138f9ae75d2b9b6",
  },
  {
    title: "The Hobbit",
    description:
      "A fantasy novel by J.R.R. Tolkien about the adventures of Bilbo Baggins.",
    price: "350",
    createdBy: "6787d8d1d138f9ae75d2b9b6",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    description:
      "A non-fiction book by Yuval Noah Harari that explores the history of our species.",
    price: "400",
    createdBy: "6787d8d1d138f9ae75d2b9b6",
  },
];

const insertDatainDb = async (req, res) => {
  try {
    const result = await Course.insertMany(data);
    console.log(result);

    res.status(200).json({ isSuccess: true });
  } catch (err) {
    console.log(err?.message);
  }
};

module.exports = {
  insertDatainDb,
};
