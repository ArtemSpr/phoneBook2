import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Legas:${password}@cluster0.nlee3ex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: `${process.argv[3] || "Default note content"}`,
  important: `${process.argv[4] || false}`,
});

note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});
