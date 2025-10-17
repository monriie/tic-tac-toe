import { useState, useEffect, useCallback } from "react";
import "./App.css";

function StarIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function FlameIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13.02 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 14.22C9.11 14.32 9.15 14.42 9.15 14.55C9.15 14.64 9.13 14.75 9.09 14.83C8.95 15 8.87 15.22 8.87 15.47C8.87 16.13 9.39 16.66 10.03 16.66C10.67 16.66 11.19 16.13 11.19 15.47C11.19 15.22 11.11 15 10.97 14.83C10.93 14.75 10.91 14.64 10.91 14.55C10.91 14.42 10.95 14.32 10.99 14.22C12.21 10.07 11.19 6.4 8.6 4.32C7.89 3.75 7.04 3.23 6.11 3C7.06 4.85 6.73 7.26 5.24 8.72C4.6 9.35 3.84 9.78 3.17 10.38C2.91 10.64 2.63 10.9 2.4 11.2C1.84 12.15 1.66 13.16 1.89 14.22C2.43 16.06 4.06 17.88 6.11 19.77C7.99 21.42 10.38 22.24 12 21.9C13.62 22.24 16.01 21.42 17.89 19.77C19.94 17.88 21.57 16.06 22.11 14.22C22.34 13.16 22.16 12.15 21.6 11.2H17.66Z" />
    </svg>
  );
}

function CrownIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5L5.5 7L9 4L12 7L15 4L18.5 7L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
    </svg>
  );
}

function Kotak({ isi, saatKlik, isWinning = false, disabled = false }) {
  return (
    <button
      type="button"
      className={`
        w-full aspect-square
        bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50
        hover:from-purple-100 hover:via-pink-100 hover:to-blue-100
        border-2 border-purple-200 hover:border-purple-300
        rounded-2xl font-extrabold transition-all duration-500 ease-out
        shadow-lg hover:shadow-xl hover:scale-105
        flex items-center justify-center
        backdrop-blur-sm
        ${
          isWinning
            ? "animate-pulse bg-gradient-to-br from-yellow-100 to-pink-200"
            : ""
        }
        ${isi ? "transform scale-100" : "hover:rotate-3"}
        ${disabled ? "cursor-not-allowed opacity-70" : ""}
      `}
      onClick={saatKlik}
      disabled={disabled}
      style={{
        animation: isi
          ? "popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
          : "none",
      }}
    >
      {isi === "✨" && (
        <StarIcon className="w-1/2 h-1/2 text-purple-500 animate-spin-slow" />
      )}
      {isi === "🔥" && (
        <FlameIcon className="w-1/2 h-1/2 text-orange-500 animate-pulse" />
      )}
    </button>
  );
}

function Papan({
  giliranX,
  kotaks,
  saatMain,
  gameMode,
  isAiThinking,
  humanSymbol,
  aiSymbol,
}) {
  const pemenangInfo = cariPemenang(kotaks);
  const pemenang = pemenangInfo ? pemenangInfo.winner : null;
  const isDraw = !pemenang && kotaks.every((kotak) => kotak !== null);

  let status;
  if (pemenang) {
    let pemenangNama = "Tidak Diketahui";
    if (gameMode === "ai") {
      pemenangNama = pemenang === humanSymbol ? "Anda" : "AI";
    } else {
      pemenangNama = pemenang === "✨" ? "Bintang" : "Api";
    }
    status = (
      <span className="flex items-center justify-center gap-2 text-center">
        <CrownIcon className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 animate-bounce" />
        <span className="text-sm sm:text-base md:text-lg lg:text-xl">
          Pemenang: {pemenangNama}
        </span>
        <CrownIcon className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 animate-bounce" />
      </span>
    );
  } else if (isDraw) {
    status = (
      <span className="text-sm sm:text-base md:text-lg lg:text-xl">
        🤝 Permainan Seri!
      </span>
    );
  } else if (gameMode === "ai") {
    const isHumanTurn =
      (giliranX && humanSymbol === "✨") || (!giliranX && humanSymbol === "🔥");
    status = (
      <span className="flex items-center justify-center gap-2 text-center">
        {isHumanTurn ? (
          <>
            {humanSymbol === "✨" ? (
              <StarIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
            ) : (
              <FlameIcon className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
            )}
            <span className="text-sm sm:text-base md:text-lg lg:text-xl">
              Giliran Anda
            </span>
          </>
        ) : (
          <>
            {aiSymbol === "✨" ? (
              <StarIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-500 animate-spin-slow" />
            ) : (
              <FlameIcon className="w-5 h-5 md:w-6 md:h-6 text-orange-500 animate-pulse" />
            )}
            <span className="text-sm sm:text-base md:text-lg lg:text-xl">
              AI Berpikir...
            </span>
          </>
        )}
      </span>
    );
  } else {
    status = (
      <span className="flex items-center justify-center gap-2 text-center">
        <span className="text-sm sm:text-base md:text-lg lg:text-xl">
          Giliran:
        </span>
        {giliranX ? (
          <>
            <StarIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-500 animate-spin-slow" />
            <span className="text-sm sm:text-base md:text-lg lg:text-xl">
              Bintang
            </span>
          </>
        ) : (
          <>
            <FlameIcon className="w-5 h-5 md:w-6 md:h-6 text-orange-500 animate-pulse" />
            <span className="text-sm sm:text-base md:text-lg lg:text-xl">
              Api
            </span>
          </>
        )}
      </span>
    );
  }

  function klikKotak(i) {
    if (pemenang || kotaks[i] || isDraw || isAiThinking) return;
    const kotakBaru = kotaks.slice();
    kotakBaru[i] = giliranX ? "✨" : "🔥";
    saatMain(kotakBaru);
  }

  return (
    <section
      aria-label="Papan Permainan"
      className="flex flex-col items-center w-full"
    >
      <div
        className="font-medium text-slate-700 mb-4 sm:mb-6 
                       bg-gradient-to-r from-white/80 to-purple-50/80 
                       px-4 sm:px-6 md:px-8 py-3 sm:py-4 
                       rounded-full shadow-lg border border-purple-200/50
                       backdrop-blur-sm animate-fade-in
                       w-full max-w-xs sm:max-w-sm md:max-w-md"
        style={{ fontFamily: "Chewy, cursive" }}
      >
        {status}
      </div>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div
          className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 
                         p-4 sm:p-6 md:p-8 
                         bg-white/30 rounded-3xl backdrop-blur-md 
                         shadow-2xl border border-white/50 aspect-square"
        >
          {kotaks.map((kotak, index) => (
            <Kotak
              key={index}
              isi={kotak}
              saatKlik={() => klikKotak(index)}
              disabled={isAiThinking}
              isWinning={pemenangInfo?.line.includes(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Permainan() {
  const [riwayat, setRiwayat] = useState([Array(9).fill(null)]);
  const [langkahSekarang, setLangkahSekarang] = useState(0);
  const [gameMode, setGameMode] = useState("player");
  const [playerGoesFirst, setPlayerGoesFirst] = useState(true);
  const [difficulty, setDifficulty] = useState("sedang"); // 'mudah', 'sedang', 'sulit'
  const [isAiThinking, setIsAiThinking] = useState(false);

  const giliranX = langkahSekarang % 2 === 0;
  const kotakSekarang = riwayat[langkahSekarang];

  const humanSymbol = playerGoesFirst ? "✨" : "🔥";
  const aiSymbol = playerGoesFirst ? "🔥" : "✨";

  const saatMain = useCallback(
    (kotakBaru) => {
      const riwayatBaru = [...riwayat.slice(0, langkahSekarang + 1), kotakBaru];
      setRiwayat(riwayatBaru);
      setLangkahSekarang(riwayatBaru.length - 1);
    },
    [riwayat, langkahSekarang]
  );

  useEffect(() => {
    const pemenang = cariPemenang(kotakSekarang);
    const isDraw = !pemenang && kotakSekarang.every((k) => k !== null);

    const isAiTurn =
      gameMode === "ai" &&
      ((aiSymbol === "✨" && giliranX) || (aiSymbol === "🔥" && !giliranX));

    if (isAiTurn && !pemenang && !isDraw) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const kotakBaru = kotakSekarang.slice();
        const move = cariLangkahTerbaik(
          kotakBaru,
          aiSymbol,
          humanSymbol,
          difficulty
        );
        if (move !== null) {
          kotakBaru[move] = aiSymbol;
          saatMain(kotakBaru);
        }
        setIsAiThinking(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    langkahSekarang,
    gameMode,
    kotakSekarang,
    aiSymbol,
    humanSymbol,
    difficulty,
    saatMain,
    giliranX,
  ]);

  function lompatKe(langkah) {
    setLangkahSekarang(langkah);
  }

  function resetPermainan() {
    setRiwayat([Array(9).fill(null)]);
    setLangkahSekarang(0);
  }

  function handleModeChange(mode) {
    setGameMode(mode);
    resetPermainan();
  }

  function handleStartPlayerChange(isPlayerStarting) {
    setPlayerGoesFirst(isPlayerStarting);
    resetPermainan();
  }

  function handleDifficultyChange(level) {
    setDifficulty(level);
    resetPermainan();
  }

  const daftarLangkah = riwayat.map((_, langkah) => {
    const deskripsi = langkah ? `Langkah ${langkah}` : "Awal permainan";
    const isActive = langkah === langkahSekarang;

    return (
      <li key={langkah} className="w-full">
        <button
          type="button"
          className={`
            text-xs sm:text-sm md:text-base transition-all duration-300 ease-out
            px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg w-full text-left
            ${
              isActive
                ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium border-2 border-purple-300"
                : "text-slate-600 hover:text-purple-700 hover:bg-purple-50 border-2 border-transparent"
            }
          `}
          style={{ fontFamily: "Chewy, cursive" }}
          onClick={() => lompatKe(langkah)}
        >
          {deskripsi}
        </button>
      </li>
    );
  });

  return (
    <>
      <style jsx>{`
        /* ... existing styles ... */
      `}</style>

      <main
        className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 
                       flex flex-col items-center justify-center 
                       px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
                       py-4 sm:py-6 md:py-8 lg:py-10
                       font-sans relative overflow-hidden"
        style={{ fontFamily: "Chewy, cursive" }}
      >
        <header className="mb-4 sm:mb-6 md:mb-8 text-center relative z-10 w-full">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                         font-bold 
                         bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 
                         bg-clip-text text-transparent
                         tracking-tight animate-fade-in
                         drop-shadow-sm"
            style={{ fontFamily: "Chewy, cursive" }}
          >
            Tic-Tac-Toe
          </h1>
          <p
            className="text-slate-600 mt-2 
                        text-sm sm:text-base md:text-lg lg:text-xl 
                        animate-fade-in px-4"
            style={{ animationDelay: "0.3s", fontFamily: "Chewy, cursive" }}
          >
            Permainan Santai & Menenangkan
          </p>
        </header>

        <section className="w-full max-w-7xl mx-auto">
          <div
            className="flex flex-col lg:flex-row lg:gap-6 xl:gap-8 items-center justify-center
                          bg-white/40 backdrop-blur-lg 
                          p-4 sm:p-6 md:p-8 lg:p-10
                          rounded-3xl shadow-2xl border border-white/50 
                          relative z-10 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="w-full lg:w-3/5 xl:w-1/2 flex justify-center">
              <Papan
                giliranX={giliranX}
                kotaks={kotakSekarang}
                saatMain={saatMain}
                gameMode={gameMode}
                isAiThinking={isAiThinking}
                humanSymbol={humanSymbol}
                aiSymbol={aiSymbol}
              />
            </div>

            <aside
              className="w-full lg:w-2/5 xl:w-1/2 
                              mt-6 lg:mt-0 
                              flex flex-col gap-4 sm:gap-6
                              max-w-md lg:max-w-none mx-auto"
            >
              <div className="bg-white/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/60 shadow-lg w-full">
                <h2
                  className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-700 mb-3 sm:mb-4 border-b border-purple-200 pb-2 flex items-center gap-2"
                  style={{ fontFamily: "Chewy, cursive" }}
                >
                  <span className="text-base sm:text-lg md:text-xl">🎮</span>
                  <span>Mode Permainan</span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleModeChange("player")}
                    className={`flex-1 text-xs sm:text-sm md:text-base transition-all duration-300 ease-out px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-center ${
                      gameMode === "player"
                        ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium border-2 border-purple-300"
                        : "text-slate-600 hover:text-purple-700 hover:bg-purple-50 border-2 border-transparent"
                    }`}
                  >
                    Lawan Teman
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange("ai")}
                    className={`flex-1 text-xs sm:text-sm md:text-base transition-all duration-300 ease-out px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-center ${
                      gameMode === "ai"
                        ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium border-2 border-purple-300"
                        : "text-slate-600 hover:text-purple-700 hover:bg-purple-50 border-2 border-transparent"
                    }`}
                  >
                    Lawan AI
                  </button>
                </div>

                {gameMode === "ai" && (
                  <>
                    <div className="mt-4 pt-4 border-t border-purple-200/50">
                      <h3
                        className="text-base sm:text-lg font-semibold text-slate-700 mb-2 text-center"
                        style={{ fontFamily: "Chewy, cursive" }}
                      >
                        Siapa yang Mulai?
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartPlayerChange(true)}
                          className={`flex-1 text-xs sm:text-sm md:text-base transition-all duration-300 ease-out px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-center ${
                            playerGoesFirst
                              ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium border-2 border-purple-300"
                              : "text-slate-600 hover:text-purple-700 hover:bg-purple-50 border-2 border-transparent"
                          }`}
                        >
                          Saya Duluan
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartPlayerChange(false)}
                          className={`flex-1 text-xs sm:text-sm md:text-base transition-all duration-300 ease-out px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-center ${
                            !playerGoesFirst
                              ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium border-2 border-purple-300"
                              : "text-slate-600 hover:text-purple-700 hover:bg-purple-50 border-2 border-transparent"
                          }`}
                        >
                          AI Duluan
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-200/50">
                      <h3
                        className="text-base sm:text-lg font-semibold text-slate-700 mb-2 text-center"
                        style={{ fontFamily: "Chewy, cursive" }}
                      >
                        Tingkat Kesulitan
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={() => handleDifficultyChange("mudah")}
                          className={`flex-1 text-xs sm:text-sm md:text-base transition-all duration-300 ease-out px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-center ${
                            difficulty === "mudah"
                              ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-700 font-medium border-2 border-green-300"
                              : "text-slate-600 hover:text-green-700 hover:bg-green-50 border-2 border-transparent"
                          }`}
                        >
                          Mudah
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDifficultyChange("sedang")}
                          className={`flex-1 text-xs sm:text-sm md:text-base transition-all duration-300 ease-out px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-center ${
                            difficulty === "sedang"
                              ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 font-medium border-2 border-yellow-300"
                              : "text-slate-600 hover:text-yellow-700 hover:bg-yellow-50 border-2 border-transparent"
                          }`}
                        >
                          Sedang
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDifficultyChange("sulit")}
                          className={`flex-1 text-xs sm:text-sm md:text-base transition-all duration-300 ease-out px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-center ${
                            difficulty === "sulit"
                              ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 font-medium border-2 border-red-300"
                              : "text-slate-600 hover:text-red-700 hover:bg-red-50 border-2 border-transparent"
                          }`}
                        >
                          Sulit
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* --- BAGIAN YANG DIKEMBALIKAN --- */}
              <nav
                aria-label="Riwayat Permainan"
                className="bg-white/50 backdrop-blur-md 
                              p-4 sm:p-6 rounded-2xl 
                              border border-white/60 shadow-lg
                              w-full"
              >
                <h2
                  className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-700 
                               mb-3 sm:mb-4 border-b border-purple-200 pb-2 
                               flex items-center gap-2"
                  style={{ fontFamily: "Chewy, cursive" }}
                >
                  <span className="text-base sm:text-lg md:text-xl">📚</span>
                  <span>Riwayat Permainan</span>
                </h2>
                <ol
                  className="space-y-2 max-h-48 sm:max-h-64 md:max-h-72 
                               overflow-y-auto custom-scrollbar"
                >
                  {daftarLangkah}
                </ol>
              </nav>

              <button
                type="button"
                className="bg-gradient-to-r from-purple-500 to-pink-500 
                           hover:from-purple-600 hover:to-pink-600
                           text-white font-semibold 
                           py-3 sm:py-4 px-6 sm:px-8
                           rounded-2xl transition-all duration-300 ease-out
                           shadow-lg hover:shadow-xl transform hover:scale-105
                           flex items-center justify-center gap-2 sm:gap-3
                           text-sm sm:text-base md:text-lg
                           w-full"
                style={{ fontFamily: "Chewy, cursive" }}
                onClick={resetPermainan}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4V2C12 1.45 11.55 1 11 1S10 1.45 10 2V4C5.58 4 2 7.58 2 12S5.58 20 10 20H11C11.55 20 12 19.55 12 19S11.55 18 11 18H10C6.69 18 4 15.31 4 12S6.69 6 10 6V8L13 5L10 2V4M22 12C22 17.5 17.5 22 12 22C11.34 22 10.7 21.92 10.08 21.78L10.93 19.85C11.28 19.94 11.63 20 12 20C16.41 20 20 16.41 20 12S16.41 4 12 4V6L9 3L12 0V2C17.5 2 22 6.5 22 12Z" />
                </svg>
                <span>Reset Permainan</span>
              </button>
              {/* --- AKHIR BAGIAN YANG DIKEMBALIKAN --- */}
            </aside>
          </div>
        </section>
      </main>

      <style jsx>{`
        /* ... existing styles ... */
      `}</style>
    </>
  );
}

function cariPemenang(kotaks) {
  const garis = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of garis) {
    const [a, b, c] = line;
    if (kotaks[a] && kotaks[a] === kotaks[b] && kotaks[a] === kotaks[c]) {
      return { winner: kotaks[a], line: line };
    }
  }
  return null;
}

function getRandomMove(kotaks) {
  const langkahTersedia = [];
  kotaks.forEach((kotak, index) => {
    if (kotak === null) {
      langkahTersedia.push(index);
    }
  });
  if (langkahTersedia.length > 0) {
    const randomIndex = Math.floor(Math.random() * langkahTersedia.length);
    return langkahTersedia[randomIndex];
  }
  return null;
}

function getStrategicMove(kotaks, aiPlayer, humanPlayer) {
  // 1. Cek apakah AI bisa menang
  for (let i = 0; i < 9; i++) {
    if (!kotaks[i]) {
      const copy = kotaks.slice();
      copy[i] = aiPlayer;
      if (cariPemenang(copy)?.winner === aiPlayer) return i;
    }
  }

  // 2. Cek apakah pemain bisa menang, dan blokir
  for (let i = 0; i < 9; i++) {
    if (!kotaks[i]) {
      const copy = kotaks.slice();
      copy[i] = humanPlayer;
      if (cariPemenang(copy)?.winner === humanPlayer) return i;
    }
  }

  // 3. Prioritaskan kotak tengah
  if (!kotaks[4]) return 4;

  // 4. Prioritaskan sudut
  const sudut = [0, 2, 6, 8];
  const sudutKosong = sudut.filter((i) => !kotaks[i]);
  if (sudutKosong.length > 0) {
    return sudutKosong[Math.floor(Math.random() * sudutKosong.length)];
  }

  // 5. Ambil sisi yang tersisa
  const sisi = [1, 3, 5, 7];
  const sisiKosong = sisi.filter((i) => !kotaks[i]);
  if (sisiKosong.length > 0) {
    return sisiKosong[Math.floor(Math.random() * sisiKosong.length)];
  }

  return null;
}

function cariLangkahTerbaik(kotaks, aiPlayer, humanPlayer, difficulty) {
  switch (difficulty) {
    case "sulit":
      return (
        getStrategicMove(kotaks, aiPlayer, humanPlayer) ?? getRandomMove(kotaks)
      );

    case "sedang":
      // 60% chance to be smart, 40% to be random
      if (Math.random() < 0.6) {
        return (
          getStrategicMove(kotaks, aiPlayer, humanPlayer) ??
          getRandomMove(kotaks)
        );
      } else {
        return getRandomMove(kotaks);
      }

    case "mudah":
    default:
      return getRandomMove(kotaks);
  }
}