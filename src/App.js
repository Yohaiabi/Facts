import "./style.css";
import { useEffect, useState } from "react";
import supabase from "./supabase";

/*
const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "Technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "Society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "Society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];
*/

function App() {
  // 1. Define state variable
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        // Turn on Loader Animation
        setIsLoading(true);
        // Loading DataBase data + Send QUERY
        let query = supabase.from("facts").select("*");
        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("votesInteresting", { ascending: false })
          .limit(1000);
        // Handle DataBase errors
        !error
          ? setFacts(facts)
          : alert("There was a problem with getting data..");
        // Turn off Loader Animation
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {/* <Counter /> */}

      {/* 2. use state variable */}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList
            facts={facts}
            currentCategory={currentCategory}
            setFacts={setFacts}
          />
        )}
      </main>
    </>
  );
}

function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
      <p className="loader-msg">Loading...</p>
    </div>
  );
}

/* Header  */
function Header({ showForm, setShowForm }) {
  const appTitle = "Facts Site";
  const btnText = showForm ? "Close" : "Share a Fact";

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Logo of my web" />
        <h1>{appTitle}</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        //3. Update state variable
        onClick={() => setShowForm((show) => !show)}
      >
        {btnText}
      </button>
    </header>
  );
}

const CATEGORIES = [
  { name: "Technology", color: "#3b82f6" },
  { name: "Science", color: "#16a34a" },
  { name: "Finance", color: "#ef4444" },
  { name: "Society", color: "#eab308" },
  { name: "Entertainment", color: "#db2777" },
  { name: "Health", color: "#14b8a6" },
  { name: "History", color: "#f97316" },
  { name: "News", color: "#8b5cf6" },
];

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("https://Example.com");
  const [category, setCategory] = useState("");
  const [isUpLoading, setIsUploading] = useState(false);

  async function handleSumbit(e) {
    // 1. Prevent browser reload
    e.preventDefault();

    // 2. Check if the data is valid. If so, create a new fact
    if (text && isValidHttpUrl(source) && category) {
      // 3. Upload the fact to SupaBase and recieve the new fact object
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      /* Create a new fact object
      const newFact = {
        id: Math.round(Math.random() * 10000000),
        text,
        source,
        category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      };
      */

      // 4. Add the new fact to the UI: add the fact to state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      // 5. Reset input fields
      setText("");
      setSource("");
      setCategory("");
      // 6. Close the form
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSumbit}>
      <input
        maxLength={200}
        className="fact-input"
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUpLoading}
      />
      <span>{200 - text.length}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
        disabled={isUpLoading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUpLoading}
      >
        <option value="">Choose Category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUpLoading}>
        Post
      </button>
    </form>
  );
}

/*Categories*/
function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>

        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, currentCategory, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="loader-msg">
        &bull; No Facts For &lt;{currentCategory}&gt; Category yet! Create the
        First One ✌️
      </p>
    );
  }
  return (
    <section id="facts-section">
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts. Add your own!</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpDating, setIsUpDating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;
  async function handleVote(columnName) {
    setIsUpDating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpDating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔ DISPUTED] </span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>

      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpDating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpDating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpDating}>
          👎 {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;

/*
function Counter() {
  // 1. Define state variable
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ fontSize: "40px" }}> {count} </span>
      <button className="btn btn-large" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </div>
  );
}
*/
