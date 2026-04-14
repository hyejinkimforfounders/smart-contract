(function () {
  const form = document.getElementById("fin-form");
  const resultEl = document.getElementById("result");
  const gradeLetterEl = document.getElementById("grade-letter");
  const gradeScoreEl = document.getElementById("grade-score");
  const ratioBody = document.getElementById("ratio-body");
  const catBody = document.getElementById("cat-body");
  const loanRecEl = document.getElementById("loan-rec");

  function num(el) {
    const v = parseFloat(el?.value);
    return Number.isFinite(v) ? v : NaN;
  }

  function scoreCurrentRatio(pct) {
    if (!Number.isFinite(pct)) return 3;
    if (pct >= 200) return 5;
    if (pct >= 150) return 4;
    if (pct >= 120) return 3;
    if (pct >= 100) return 2;
    return 1;
  }

  function scoreQuickRatio(pct) {
    if (!Number.isFinite(pct)) return 3;
    if (pct >= 120) return 5;
    if (pct >= 100) return 4;
    if (pct >= 80) return 3;
    if (pct >= 50) return 2;
    return 1;
  }

  function scoreDebtRatio(pct) {
    if (!Number.isFinite(pct)) return 3;
    if (pct <= 100) return 5;
    if (pct <= 200) return 4;
    if (pct <= 300) return 3;
    if (pct <= 400) return 2;
    return 1;
  }

  function scoreInterestCov(x) {
    if (!Number.isFinite(x)) return 3;
    if (x === Infinity) return 5;
    if (x >= 8) return 5;
    if (x >= 5) return 4;
    if (x >= 3) return 3;
    if (x >= 1) return 2;
    return 1;
  }

  function scoreOpMargin(pct) {
    if (!Number.isFinite(pct)) return 3;
    if (pct >= 10) return 5;
    if (pct >= 5) return 4;
    if (pct >= 2) return 3;
    if (pct >= 0) return 2;
    return 1;
  }

  function scoreROA(pct) {
    if (!Number.isFinite(pct)) return 3;
    if (pct >= 5) return 5;
    if (pct >= 3) return 4;
    if (pct >= 1) return 3;
    if (pct >= 0) return 2;
    return 1;
  }

  function scoreROE(pct) {
    if (!Number.isFinite(pct)) return 3;
    if (pct >= 15) return 5;
    if (pct >= 10) return 4;
    if (pct >= 5) return 3;
    if (pct >= 0) return 2;
    return 1;
  }

  function scoreGrowth(pct) {
    if (!Number.isFinite(pct)) return 3;
    if (pct >= 15) return 5;
    if (pct >= 5) return 4;
    if (pct >= 0) return 3;
    if (pct >= -10) return 2;
    return 1;
  }

  function scoreProfitGrowth(pct) {
    if (!Number.isFinite(pct)) return 3;
    if (pct >= 20) return 5;
    if (pct >= 10) return 4;
    if (pct >= 0) return 3;
    if (pct >= -20) return 2;
    return 1;
  }

  function scoreCfQuality(ratio) {
    if (!Number.isFinite(ratio)) return 3;
    if (ratio >= 1.0) return 5;
    if (ratio >= 0.7) return 4;
    if (ratio >= 0.4) return 3;
    if (ratio >= 0) return 2;
    return 1;
  }

  function tagForScore(s) {
    if (s >= 4) return { cls: "ok", text: "우량" };
    if (s >= 3) return { cls: "mid", text: "보통" };
    return { cls: "bad", text: "취약" };
  }

  function gradeFromAvg(avg) {
    if (avg >= 4.2) return "A";
    if (avg >= 3.4) return "B";
    if (avg >= 2.6) return "C";
    if (avg >= 1.8) return "D";
    return "E";
  }

  function loanAdvice(grade) {
    const map = {
      A: {
        rate: "시장 기준금리 대비 +0.5~1.0%p 이내(우량 가산 최소)",
        limit: "연 매출·현금흐름 대비 여유 한도, 회전대출 위주 검토 가능",
        collateral: "부동산·채권담보 LTV 완화 또는 신용·보증 비중 확대 여지",
      },
      B: {
        rate: "+1.0~2.0%p 가산을 기본 전제로 한도·기간 조정",
        limit: "당좌·현금흐름 커버리지 확인 후 단계적 증액",
        collateral: "담보 100~200% 수준(채권양도·부동산) 병행 권고",
      },
      C: {
        rate: "+2.0~3.5%p, 조건부 승인·분할 실행 검토",
        limit: "필요자금 중심의 보수적 한도, 용도·집행 관리 강화",
        collateral: "담보 150~250% 또는 연대보증·보증기관 보증 병행",
      },
      D: {
        rate: "+3.5~5.0%p 이상, 기한 연장·이자만 상환 구조는 신중",
        limit: "한도 축소·트랜치(분할) 지급, 회수 계획 병행",
        collateral: "실질 담보 200% 이상 또는 자산 처분·추가 출자 조건 검토",
      },
      E: {
        rate: "신규 취급 어려움 — 구조조정·자본확충·보증 없이는 부적격 가능",
        limit: "운전자금 한시 지원 또는 회수·정리 중심",
        collateral: "강담보·전액보증 또는 거래 중단·추심 검토",
      },
    };
    return map[grade] || map.E;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const ca = num({ value: fd.get("ca") });
    const cl = num({ value: fd.get("cl") });
    const inv = num({ value: fd.get("inv") });
    const td = num({ value: fd.get("td") });
    const eq = num({ value: fd.get("eq") });
    const op = num({ value: fd.get("op") });
    const intExp = num({ value: fd.get("int") });
    const rev = num({ value: fd.get("rev") });
    const ni = num({ value: fd.get("ni") });
    const ta = num({ value: fd.get("ta") });
    const rev0 = num({ value: fd.get("rev0") });
    const ni0 = num({ value: fd.get("ni0") });
    const ocf = num({ value: fd.get("ocf") });

    const currentRatio = cl > 0 ? (ca / cl) * 100 : NaN;
    const quickRatio = cl > 0 ? ((ca - inv) / cl) * 100 : NaN;

    let debtRatio = NaN;
    let sDr;
    if (eq > 0) {
      debtRatio = (td / eq) * 100;
      sDr = scoreDebtRatio(debtRatio);
    } else if (Number.isFinite(eq) && eq <= 0 && td > 0) {
      sDr = 1;
    } else {
      sDr = scoreDebtRatio(NaN);
    }
    let interestCov = NaN;
    if (intExp > 0) interestCov = op / intExp;
    else if (intExp === 0 && Number.isFinite(op)) interestCov = op >= 0 ? Infinity : NaN;

    const opMargin = rev > 0 ? (op / rev) * 100 : NaN;
    const roa = ta > 0 ? (ni / ta) * 100 : NaN;
    const roe = eq > 0 ? (ni / eq) * 100 : NaN;

    let salesGrowth = NaN;
    if (rev0 > 0 && Number.isFinite(rev)) salesGrowth = ((rev - rev0) / rev0) * 100;
    let profitGrowth = NaN;
    if (Number.isFinite(ni0) && ni0 !== 0 && Number.isFinite(ni)) profitGrowth = ((ni - ni0) / Math.abs(ni0)) * 100;

    let cfRatio = NaN;
    if (ni !== 0 && Number.isFinite(ocf)) cfRatio = ocf / ni;

    const sCr = scoreCurrentRatio(currentRatio);
    const sQr = scoreQuickRatio(quickRatio);
    const liquidity = (sCr + sQr) / 2;

    const sIc = scoreInterestCov(interestCov);
    const leverage = (sDr + sIc) / 2;

    const sOm = scoreOpMargin(opMargin);
    const sRoa = scoreROA(roa);
    const sRoe =
      eq > 0 ? scoreROE(roe) : Number.isFinite(eq) && eq <= 0 ? 1 : scoreROE(NaN);
    const profitability = (sOm + sRoa + sRoe) / 3;

    const sSg = scoreGrowth(salesGrowth);
    const sPg = scoreProfitGrowth(profitGrowth);
    const growth = (sSg + sPg) / 2;

    const sCf = scoreCfQuality(cfRatio);
    const cashflow = sCf;

    const weights = {
      liquidity: 0.2,
      leverage: 0.2,
      profitability: 0.2,
      growth: 0.2,
      cashflow: 0.2,
    };

    const overall =
      liquidity * weights.liquidity +
      leverage * weights.leverage +
      profitability * weights.profitability +
      growth * weights.growth +
      cashflow * weights.cashflow;

    const grade = gradeFromAvg(overall);

    const fmtPct = (v) => (Number.isFinite(v) ? `${v.toFixed(1)}%` : "—");
    const debtRatioDisplay =
      eq > 0
        ? fmtPct(debtRatio)
        : Number.isFinite(eq) && eq <= 0 && td > 0
          ? "자본잠식"
          : "—";
    const roeDisplay =
      eq > 0 ? fmtPct(roe) : Number.isFinite(eq) && eq <= 0 ? "자본잠식" : "—";
    const fmtNum = (v, d = 2) => (Number.isFinite(v) ? (v === Infinity ? "∞" : v.toFixed(d)) : "—");
    const fmtTimes = (v) => (Number.isFinite(v) ? (v === Infinity ? "해당 없음(이자비용 0)" : `${fmtNum(v, 2)}배`) : "—");

    const ratios = [
      { name: "유동비율", value: fmtPct(currentRatio), score: sCr },
      { name: "당좌비율", value: fmtPct(quickRatio), score: sQr },
      { name: "부채비율 (총부채/자본)", value: debtRatioDisplay, score: sDr },
      { name: "이자보상배율 (영업이익/이자비용)", value: fmtTimes(interestCov), score: sIc },
      { name: "영업이익률", value: fmtPct(opMargin), score: sOm },
      { name: "ROA", value: fmtPct(roa), score: sRoa },
      { name: "ROE", value: roeDisplay, score: sRoe },
      { name: "매출증가율 (전기比)", value: fmtPct(salesGrowth), score: sSg },
      { name: "순이익증가율 (전기比)", value: fmtPct(profitGrowth), score: sPg },
      { name: "영업CF/순이익", value: Number.isFinite(cfRatio) ? cfRatio.toFixed(2) : "—", score: sCf },
    ];

    ratioBody.innerHTML = ratios
      .map((r) => {
        const t = tagForScore(r.score);
        return `<tr><td>${r.name}</td><td>${r.value}</td><td><span class="tag ${t.cls}">${t.text}</span></td></tr>`;
      })
      .join("");

    const fixTag = (s) => tagForScore(s);
    const categories = [
      { name: "단기 유동성", score: liquidity, detail: `유동·당좌 (${sCr.toFixed(1)}, ${sQr.toFixed(1)})` },
      { name: "레버리지", score: leverage, detail: `부채·이자보상 (${sDr.toFixed(1)}, ${sIc.toFixed(1)})` },
      { name: "수익성", score: profitability, detail: `영업이익률·ROA·ROE` },
      { name: "성장성", score: growth, detail: `매출·이익 증가` },
      { name: "현금흐름", score: cashflow, detail: `영업CF/순이익` },
    ];

    catBody.innerHTML = categories
      .map((c) => {
        const t = fixTag(c.score);
        return `<tr><td>${c.name}</td><td><strong>${c.score.toFixed(2)}</strong> <span class="tag ${t.cls}">${t.text}</span></td><td>${c.detail}</td></tr>`;
      })
      .join("");

    gradeLetterEl.textContent = grade;
    gradeLetterEl.className = `grade ${grade.toLowerCase()}`;
    gradeScoreEl.textContent = overall.toFixed(2);

    const adv = loanAdvice(grade);
    loanRecEl.innerHTML = `
      <p><strong>적정 금리(가산)</strong> — ${adv.rate}</p>
      <p><strong>한도</strong> — ${adv.limit}</p>
      <p><strong>담보·완화 방안</strong> — ${adv.collateral}</p>
      <ul>
        <li>등급 ${grade}: 종합점수 ${overall.toFixed(2)} / 5.00 (5개 영역 동일 가중)</li>
        <li>업종·계절성·일회성 손익은 별도 조정이 필요합니다.</li>
      </ul>
    `;

    resultEl.classList.remove("hidden");
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("reset", () => {
    setTimeout(() => resultEl.classList.add("hidden"), 0);
  });
})();
