// Main application logic for whodis.gg

async function handleSearch() {
  const resultsDiv = document.getElementById('results');
  const statusDiv = document.getElementById('status');
  resultsDiv.innerHTML = '';
  statusDiv.textContent = 'Searching... (Note: API requires a key for live queries)';

  const nameA = document.getElementById('playerAName').value.trim();
  const regionA = document.getElementById('playerARegion').value;
  const nameB = document.getElementById('playerBName').value.trim();
  const regionB = document.getElementById('playerBRegion').value;

  if (!nameA || !nameB) {
    statusDiv.textContent = 'Please enter both usernames.';
    return;
  }

  // MVP Note: In production, this calls the Riot API via a backend proxy.
  // For this demo, we show the intended result format.
  resultsDiv.innerHTML = `
    <div class="bg-slate-950 border border-slate-700 rounded-xl p-6 shadow-md">
      <h3 class="text-lg font-bold text-amber-200 mb-2">Demo / Placeholder Mode</h3>
      <p class="text-slate-400 mb-3">
        This is a demonstration of the output format. To use live data, a Riot Games API key is required.
      </p>
      <div class="text-sm space-y-2 text-slate-300">
        <p><span class="font-semibold text-amber-300">Player A:</span> ${nameA} (${regionA})</p>
        <p><span class="font-semibold text-amber-300">Player B:</span> ${nameB} (${regionB})</p>
      </div>
      <hr class="border-slate-800 my-3" />
      <p class="text-sm text-slate-500">
        Once connected to the Riot API, this section will list shared games with:
        <ul class="list-disc list-inside mt-1 pl-4 text-slate-400">
          <li>Match date and time</li>
          <li>Game mode and queue</li>
          <li>Win / Loss result</li>
          <li>Champion picks for both players</li>
          <li>Links to op.gg / u.gg for full match details</li>
        </ul>
      </p>
      <a href="https://developer.riotgames.com/" target="_blank" class="inline-block mt-3 text-sm font-semibold text-amber-400 hover:text-amber-300 underline">Get a Riot API Key →</a>
    </div>
  `;

  statusDiv.textContent = `Searched for: ${nameA} (${regionA}) vs ${nameB} (${regionB})`;
}
