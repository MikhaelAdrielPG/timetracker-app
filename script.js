document.addEventListener("DOMContentLoaded", () => {
  // Mengambil elemen-elemen DOM
  const minutesDisplay = document.getElementById("minutes");
  const secondsDisplay = document.getElementById("seconds");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const resetBtn = document.getElementById("reset-btn");
  const pomodoroInput = document.getElementById("pomodoro-duration");
  const shortBreakInput = document.getElementById("short-break-duration");
  const longBreakInput = document.getElementById("long-break-duration");
  const themeToggleBtn = document.getElementById("theme-toggle");

  // Tombol untuk memilih sesi
  const pomodoroBtn = document.getElementById("pomodoro-btn");
  const shortBreakBtn = document.getElementById("short-break-btn");
  const longBreakBtn = document.getElementById("long-break-btn");
  const sessionButtons = [pomodoroBtn, shortBreakBtn, longBreakBtn];

  // Variabel untuk menyimpan state aplikasi
  let timerInterval = null;
  let isRunning = false;
  let totalSeconds = 25 * 60;
  let pomodoroCount = 0;
  let currentSession = "pomodoro";

  // Fungsi untuk memperbarui tampilan waktu
  function updateDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
  }

  // Fungsi untuk memperbarui tombol sesi yang aktif
  function updateActiveButton(sessionType) {
    sessionButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    if (sessionType === "pomodoro") {
      pomodoroBtn.classList.add("active");
    } else if (sessionType === "short-break") {
      shortBreakBtn.classList.add("active");
    } else if (sessionType === "long-break") {
      longBreakBtn.classList.add("active");
    }
  }

  // Fungsi untuk memulai timer
  function startTimer() {
    // Jika timer sudah berjalan, jangan lakukan apa-apa
    if (isRunning) return;
    isRunning = true;

    const iconPath = playPauseBtn.querySelector("svg path");
    iconPath.setAttribute("d", "M14 19h-4V5h4v14zm-6 0H4V5h4v14z");

    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        handleSessionEnd();
      }
    }, 1000);
  }

  // Fungsi untuk menghentikan timer sementara
  function pauseTimer() {
    // Jika timer tidak berjalan, jangan lakukan apa-apa
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);

    const iconPath = playPauseBtn.querySelector("svg path");
    iconPath.setAttribute("d", "M8 5v14l11-7z");
  }

  // Fungsi untuk mereset timer
  function resetTimer() {
    pauseTimer();
    pomodoroCount = 0;
    currentSession = "pomodoro";
    totalSeconds = parseInt(pomodoroInput.value) * 60;
    updateDisplay();
    updateActiveButton("pomodoro");
  }

  // Fungsi yang dipanggil saat satu sesi selesai
  function handleSessionEnd() {
    // Tentukan sesi berikutnya berdasarkan sesi saat ini dan hitungan pomodoro
    if (currentSession === "pomodoro") {
      pomodoroCount++;
      if (pomodoroCount >= 4) {
        currentSession = "long-break";
        totalSeconds = parseInt(longBreakInput.value) * 60;
        pomodoroCount = 0;
        alert("Sesi istirahat panjang! Ambil napas dalam-dalam.");
      } else {
        currentSession = "short-break";
        totalSeconds = parseInt(shortBreakInput.value) * 60;
        alert("Sesi istirahat pendek! Regangkan badanmu.");
      }
    } else {
      // Setelah istirahat, kembali ke sesi pomodoro
      currentSession = "pomodoro";
      totalSeconds = parseInt(pomodoroInput.value) * 60;
      alert("Waktunya kembali fokus!");
    }
    updateDisplay();
    updateActiveButton(currentSession);
  }

  // Event listener untuk tombol play/pause
  playPauseBtn.addEventListener("click", () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  // Event listener untuk tombol reset
  resetBtn.addEventListener("click", resetTimer);

  // Event listener untuk tombol pemilihan sesi
  pomodoroBtn.addEventListener("click", () => {
    pauseTimer();
    currentSession = "pomodoro";
    totalSeconds = parseInt(pomodoroInput.value) * 60;
    updateDisplay();
    updateActiveButton("pomodoro");
  });
  shortBreakBtn.addEventListener("click", () => {
    pauseTimer();
    currentSession = "short-break";
    totalSeconds = parseInt(shortBreakInput.value) * 60;
    updateDisplay();
    updateActiveButton("short-break");
  });
  longBreakBtn.addEventListener("click", () => {
    pauseTimer();
    currentSession = "long-break";
    totalSeconds = parseInt(longBreakInput.value) * 60;
    updateDisplay();
    updateActiveButton("long-break");
  });

  // Event listener untuk memperbarui waktu saat nilai input berubah
  pomodoroInput.addEventListener("change", () => {
    if (!isRunning && currentSession === "pomodoro") {
      totalSeconds = parseInt(pomodoroInput.value) * 60;
      updateDisplay();
    }
  });

  shortBreakInput.addEventListener("change", () => {
    if (!isRunning && currentSession === "short-break") {
      totalSeconds = parseInt(shortBreakInput.value) * 60;
      updateDisplay();
    }
  });

  longBreakInput.addEventListener("change", () => {
    if (!isRunning && currentSession === "long-break") {
      totalSeconds = parseInt(longBreakInput.value) * 60;
      updateDisplay();
    }
  });

  // Event listener untuk mengganti Dark/Light Mode
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    // Mengganti ikon tema (matahari/bulan)
    const iconPath = themeToggleBtn.querySelector("svg path");
    if (document.body.classList.contains("dark-mode")) {
      iconPath.setAttribute(
        "d",
        "M9.597 2.25a.75.75 0 0 1-.586.992A6.75 6.75 0 0 0 7.25 9a7.5 7.5 0 1 0 14.538-3.256.75.75 0 0 1-1.002-.676A5.25 5.25 0 0 1 12.75 3a.75.75 0 0 1-.75-.75Zm-2.348 7.25a5.25 5.25 0 0 1 5.204-5.234A7.478 7.478 0 0 0 9 12a7.478 7.478 0 0 0-2.348-5.25Z"
      );
    } else {
      iconPath.setAttribute(
        "d",
        "M12 2.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Zm7.75 4.09a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM21 12a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75Zm-4.09 7.75a.75.75 0 0 1-1.06 0l-1.06-1.06a.75.75 0 1 1 1.06-1.06l1.06 1.06a.75.75 0 0 1 0 1.06ZM12 21a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75ZM6.25 17.75a.75.75 0 0 1-1.06 0l-1.06-1.06a.75.75 0 1 1 1.06-1.06l1.06 1.06a.75.75 0 0 1 0 1.06ZM3 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm3.25-5.75a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 0 1 1.06 1.06L7.31 7.25a.75.75 0 0 1-1.06 0ZM12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"
      );
    }
  });

  // Perbarui tampilan waktu saat aplikasi dimuat
  updateDisplay();
  updateActiveButton(currentSession);
});
