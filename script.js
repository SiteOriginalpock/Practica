document.addEventListener("DOMContentLoaded", function () {
  // Elemente
  const lunaSelect = document.getElementById("month");
  const saptamanaSelect = document.getElementById("week");
  const listSelect = document.getElementById("listSelect");
  const searchInput = document.getElementById("searchInput");
  const scheduleTable = document.querySelector(".schedule");
  const dayButtons = document.querySelectorAll(".week-days .day");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const monthlyButton = document.getElementById("monthly-btn");
  const monthlyCalendar = document.getElementById("monthly-calendar");
  const googleButton = document.getElementById("google-sync");
  const daysTable = document.querySelector(".days-table");

  // Dicționar luni
  const luni = {
    Ianuarie: 1, Februarie: 2, Martie: 3, Aprilie: 4,
    Mai: 5, Iunie: 6, Iulie: 7, August: 8,
    Septembrie: 9, Octombrie: 10, Noiembrie: 11, Decembrie: 12
  };

  // Mock date
  const mockData = {
    grupe: ["TI-231", "TI-232", "TI-233"],
    profesori: ["Popescu Ion", "Ionescu Maria", "Ceban Victor"],
    aule: ["A101", "B202", "C303"]
  };

  const mockSchedule = {
    "01.02.2025-07.02.2025": {
      Luni: ["Matematică - A101", "Informatica - B202"],
      Marți: ["Programare - C303"],
      Miercuri: [],
      Joi: ["Baze de date - A101"],
      Vineri: ["Engleză - B202"],
      Sâmbătă: [],
      Duminică: []
    },
    "08.02.2025-14.02.2025": {
      Luni: ["Algoritmi - A101"],
      Marți: ["Structuri de date - B202"],
      Miercuri: ["Fizică - C303"],
      Joi: [],
      Vineri: ["Matematică - B202"],
      Sâmbătă: [],
      Duminică: []
    }
  };

  let allItems = [];

  // --------------------------
  // Funcții auxiliare
  // --------------------------

  function renderList(items) {
    listSelect.innerHTML = "";
    items.forEach(el => {
      const opt = document.createElement("option");
      opt.textContent = el;
      listSelect.appendChild(opt);
    });
  }

  function displaySchedule(week, day = null) {
    const schedule = mockSchedule[week] || {};
    const rows = scheduleTable.querySelectorAll("tr");
    rows.forEach((row, i) => {
      if (i === 0) return; // skip header
      const lessonCell = row.querySelector(".lesson");
      lessonCell.textContent = "";
    });

    if (!day) {
      // prima lecție din fiecare zi
      let i = 1;
      for (const d in schedule) {
        const cell = scheduleTable.rows[i]?.querySelector(".lesson");
        if (cell) cell.textContent = schedule[d][0] || "";
        i++;
      }
    } else {
      const lessons = schedule[day] || [];
      lessons.forEach((l, idx) => {
        if (scheduleTable.rows[idx + 1]) {
          scheduleTable.rows[idx + 1].querySelector(".lesson").textContent = l;
        }
      });
    }
  }

  function generateWeeks(numeLuna, an = 2025) {
    saptamanaSelect.innerHTML = "";
    const luna = luni[numeLuna];
    const primaZi = new Date(an, luna - 1, 1);
    const ultimaZi = new Date(an, luna, 0);
    let nrSapt = 1;
    let ziStart = new Date(primaZi);

    while (ziStart <= ultimaZi) {
      let ziEnd = new Date(ziStart);
      ziEnd.setDate(ziEnd.getDate() + 6);
      if (ziEnd > ultimaZi) ziEnd = ultimaZi;

      const opt = document.createElement("option");
      opt.value = `${ziStart.getDate().toString().padStart(2,"0")}.${(luna).toString().padStart(2,"0")}.${ziStart.getFullYear()}-${ziEnd.getDate().toString().padStart(2,"0")}.${(luna).toString().padStart(2,"0")}.${ziEnd.getFullYear()}`;
      opt.textContent = `${nrSapt} (${ziStart.toLocaleDateString("ro-RO")} - ${ziEnd.toLocaleDateString("ro-RO")})`;
      saptamanaSelect.appendChild(opt);

      ziStart.setDate(ziStart.getDate() + 7);
      nrSapt++;
    }
  }

  function generateMonthlyCalendar() {
    monthlyCalendar.innerHTML = "";
    const monthIndex = lunaSelect.selectedIndex;
    const year = 2025;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const div = document.createElement("div");
      div.textContent = d;
      div.addEventListener("click", () => {
        const selectedWeek = saptamanaSelect.value;
        displaySchedule(selectedWeek);
      });
      monthlyCalendar.appendChild(div);
    }
  }

  function updateDaysTable(weekRange) {
    if (!weekRange) return;
    const [start, end] = weekRange.split("-");
    const [startDay, startMonth, startYear] = start.split(".");
    const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
    const dayNames = ["L", "Ma", "Mi", "J", "V", "S", "D"];
    let html = "";

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dayLabel = `${dayNames[i]} - ${d.getDate()}`;
      html += `<tr><td class="day-cell">${dayLabel}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
    }

    daysTable.innerHTML = html;
  }

  // --------------------------
  // Evenimente
  // --------------------------

  // Initializare săptămâni
  generateWeeks(lunaSelect.value);

  lunaSelect.addEventListener("change", () => {
    generateWeeks(lunaSelect.value);
  });

  saptamanaSelect.addEventListener("change", () => {
    const week = saptamanaSelect.value;
    displaySchedule(week);
    updateDaysTable(week);
  });

  monthlyButton.addEventListener("click", () => {
    generateMonthlyCalendar();
    monthlyCalendar.classList.remove("hidden");
    monthlyCalendar.scrollIntoView({ behavior: "smooth" });
  });

  googleButton.addEventListener("click", () => {
    window.open("https://calendar.google.com/calendar/r", "_blank");
  });

  dayButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const week = saptamanaSelect.value;
      if (!week) return;
      displaySchedule(week, btn.textContent);
    });
  });

  prevBtn.addEventListener("click", () => {
    if (saptamanaSelect.selectedIndex > 0) {
      saptamanaSelect.selectedIndex -= 1;
      saptamanaSelect.dispatchEvent(new Event("change"));
    }
  });

  nextBtn.addEventListener("click", () => {
    if (saptamanaSelect.selectedIndex < saptamanaSelect.options.length - 1) {
      saptamanaSelect.selectedIndex += 1;
      saptamanaSelect.dispatchEvent(new Event("change"));
    }
  });

  // Butoane Grupe/Profesori/Aule (mock)
  document.querySelectorAll(".nav-buttons .btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.textContent.toLowerCase();
      renderList(mockData[key]);
    });
  });

  // Filtrare live
  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    Array.from(listSelect.options).forEach(opt => {
      opt.style.display = opt.textContent.toLowerCase().includes(filter) ? "block" : "none";
    });
  });
});
  