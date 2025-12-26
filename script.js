const fetchBtn = document.getElementById("fetchBtn");
const issuesDiv = document.getElementById("issues");

fetchBtn.addEventListener("click", async () => {
  const repo = document.getElementById("repoInput").value;
  issuesDiv.innerHTML = "Loading...";

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/issues?state=open&labels=good%20first%20issue`);
    
    if(!res.ok) {
      throw new Error("Repository not found or API error");
    }
    
    const data = await res.json();

    issuesDiv.innerHTML = "";

    if(data.length === 0) {
      issuesDiv.innerHTML = "No good first issues found.";
      return;
    }
    
    data.forEach(issue => {
      if(issue.pull_request) return;

      const div = document.createElement("div");
      div.className = "issue";

      div.innerHTML = `
        <h3>${issue.title}</h3>
        <p>${issue.labels.map(l => l.name).join(", ")}</p>
        <a href="${issue.html_url}" target="_blank">View Issue</a>
      `;

      issuesDiv.appendChild(div);
    });
  } catch (err) {
    issuesDiv.innerHTML = "Error fetching issues";
  }
});
