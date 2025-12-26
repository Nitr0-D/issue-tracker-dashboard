const form = document.getElementById("repoForm");
const repoInput = document.getElementById("repoInput");
const issuesDiv = document.getElementById("issuesDiv");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const repo = repoInput.value.trim();
  if (!repo) {
    issuesDiv.innerHTML = "Please enter a repository name.";
    return;
  }

  issuesDiv.innerHTML = "Loading issues...";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/issues?state=open&labels=good%20first%20issue`
    );

    if (!res.ok) {
      throw new Error("Repository not found or API error");
    }

    const data = await res.json();

    if (data.length === 0) {
      issuesDiv.innerHTML = "No good first issues found.";
      return;
    }

    issuesDiv.innerHTML = ""; // Clear previous results

    data.forEach((issue) => {
      if (issue.pull_request) return; // Skip PRs

      const issueEl = document.createElement("div");
      issueEl.classList.add("issue");

      issueEl.innerHTML = `
        <a href="${issue.html_url}" target="_blank">${issue.title}</a>
        <p>By: ${issue.user.login}</p>
      `;

      issuesDiv.appendChild(issueEl);
    });
  } catch (err) {
    issuesDiv.innerHTML = `Error: ${err.message}`;
  }
});
