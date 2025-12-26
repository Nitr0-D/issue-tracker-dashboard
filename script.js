let currentPage = 1;
const PER_PAGE = 10;

document.querySelectorAll("#quickRepos button").forEach(btn => {
  btn.addEventListener("click", () => {
    repoInput.value = btn.dataset.repo;
    form.dispatchEvent(new Event("submit"));
  });
});

document.getElementById("next").onclick = () => {
  currentPage++;
  form.dispatchEvent(new Event("submit"));
}; 
document.getElementById("prev").onclick = () => {
  if(currentPage > 1) {
    currentPage--;
    form.dispatchEvent(new Event("submit"));
  }
};

const form = document.getElementById("repoForm");
const repoInput = document.getElementById("repoInput");
const labelSelect = documnent.getElementByID("labelSelect");
const issuesDiv = document.getElementById("issuesDiv");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const repo = repoInput.value.trim();
  if (!repo) {
    issuesDiv.innerHTML = "Please enter a repository name.";
    return;
  }

  const labels = Arraay.from(labelSelect.selectedOptions).map(opt => opt.value).join(',');
  issuesDiv.innerHTML = "Loading issues...";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/issues?state=open&labels=${encodeURLComponent(labels)}&per_page=${PER_PAGE}&page=${currentPage}`
    );

    const remaining = res.headers.get("X-RateLimit-Remaining");
    if(remaining === "0") {
      issuesDiv.innerHTML = "API rate limit reached. Try again after some time.";
      return;
    }
    
    if (!res.ok) {
      throw new Error("Repository not found or API error");
    }

    const data = await res.json();

    if (data.length === 0) {
      issuesDiv.innerHTML = "No matching issues found.";
      return;
    }

    issuesDiv.innerHTML = "";

    data.forEach((issue) => {
      if (issue.pull_request) return;

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
