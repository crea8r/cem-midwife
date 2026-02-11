import { useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

const CASE_TIME_LIMIT = 45

const caseTemplates = [
  {
    title: 'Tăng huyết áp thai kỳ 36 tuần',
    context:
      'Sản phụ 28 tuổi, G1P0, thai 36 tuần, than đau đầu và nhìn mờ. Huyết áp đo 2 lần cách nhau 15 phút đều 154/102 mmHg, phù nhẹ 2 chân.',
    question: 'Hành động ưu tiên đầu tiên của hộ sinh là gì?',
    options: [
      'Cho bệnh nhân về nghỉ ngơi và tái khám sau 3 ngày',
      'Đánh giá dấu hiệu nặng, báo bác sĩ và theo dõi sát mẹ-thai',
      'Chỉ cho uống vitamin và theo dõi tại nhà',
      'Tiêm oxytocin để dự phòng chuyển dạ',
    ],
    answer: 1,
    rationale:
      'Theo thực hành sản khoa chuẩn, huyết áp cao kèm triệu chứng thần kinh là dấu hiệu nguy cơ tiền sản giật cần đánh giá và chuyển xử trí kịp thời.',
  },
  {
    title: 'Ra huyết âm đạo 3 tháng cuối',
    context:
      'Thai phụ 32 tuần vào viện vì ra máu đỏ tươi, không đau bụng. Mạch 96, HA 110/70, tim thai 146 lần/phút.',
    question: 'Bước phù hợp nhất ngay lúc tiếp nhận?',
    options: [
      'Thăm âm đạo bằng tay ngay để đánh giá cổ tử cung',
      'Cho bệnh nhân đi lại để theo dõi lượng máu',
      'Đặt đường truyền, theo dõi sinh hiệu, chuẩn bị siêu âm và báo bác sĩ',
      'Cho xuất viện vì chưa có cơn co tử cung',
    ],
    answer: 2,
    rationale:
      'Ra huyết 3 tháng cuối cần ưu tiên ổn định mẹ-thai, theo dõi sát và đánh giá nguyên nhân bằng phương tiện phù hợp; tránh can thiệp có thể làm nặng thêm chảy máu.',
  },
  {
    title: 'Dọa sinh non',
    context:
      'Sản phụ 30 tuần, đau bụng từng cơn 10 phút/lần, cổ tử cung mở 1cm, ối còn, tim thai ổn định.',
    question: 'Mục tiêu chăm sóc trước mắt của hộ sinh?',
    options: [
      'Đẩy nhanh chuyển dạ để kết thúc thai kỳ sớm',
      'Theo dõi cơn co, dấu hiệu nhiễm trùng, phối hợp xử trí giữ thai khi có chỉ định',
      'Không cần theo dõi vì cổ tử cung mới mở ít',
      'Cho bệnh nhân tự dùng thuốc giảm đau tại nhà',
    ],
    answer: 1,
    rationale:
      'Dọa sinh non cần theo dõi sát tiến triển cơn co và tình trạng mẹ-thai để can thiệp phù hợp, giảm nguy cơ sinh non thực sự.',
  },
  {
    title: 'Vỡ ối non đủ tháng',
    context:
      'Thai phụ 39 tuần, ra nước âm đạo trong, không sốt, tim thai 140 lần/phút, cơn co chưa đều.',
    question: 'Can thiệp điều dưỡng-hộ sinh phù hợp?',
    options: [
      'Hạn chế theo dõi vì chưa có cơn co mạnh',
      'Theo dõi dấu hiệu nhiễm trùng, tim thai và tiến triển chuyển dạ',
      'Cho ngâm bồn nước nóng kéo dài',
      'Cho về nhà chờ khi nào đau nhiều mới quay lại',
    ],
    answer: 1,
    rationale:
      'Sau vỡ ối cần theo dõi nhiễm trùng và tình trạng thai định kỳ để đảm bảo an toàn cho mẹ và bé.',
  },
  {
    title: 'Băng huyết sau sinh sớm',
    context:
      'Sau sinh thường 20 phút, sản phụ chảy máu nhiều, tử cung mềm, mạch nhanh 112 lần/phút.',
    question: 'Hành động ưu tiên của hộ sinh?',
    options: [
      'Xoa đáy tử cung, gọi hỗ trợ khẩn và thực hiện phác đồ băng huyết',
      'Chờ thêm 30 phút để theo dõi tự cầm máu',
      'Cho uống nước đường rồi tiếp tục theo dõi',
      'Chỉ ghi hồ sơ và đợi bác sĩ tới',
    ],
    answer: 0,
    rationale:
      'Đờ tử cung là nguyên nhân thường gặp của băng huyết sau sinh; cần xử trí khẩn theo quy trình để giảm nguy cơ sốc mất máu.',
  },
  {
    title: 'Nghi ngờ thai suy trong chuyển dạ',
    context:
      'Sản phụ đang chuyển dạ, monitor ghi nhịp tim thai giảm kéo dài còn 90-100 lần/phút trong 4 phút.',
    question: 'Xử trí ban đầu nào đúng?',
    options: [
      'Để sản phụ tiếp tục rặn mạnh liên tục',
      'Đổi tư thế mẹ, hỗ trợ oxy khi cần và báo bác sĩ ngay',
      'Ngắt theo dõi tim thai để bệnh nhân đỡ lo lắng',
      'Chờ đủ 30 phút mới báo cáo',
    ],
    answer: 1,
    rationale:
      'Nhịp tim thai giảm kéo dài là dấu hiệu cảnh báo, cần các bước hồi sức trong tử cung và phối hợp bác sĩ ngay lập tức.',
  },
  {
    title: 'Nôn nhiều do thai nghén',
    context:
      'Thai 10 tuần, nôn nhiều, sụt 2kg trong 1 tuần, niêm mạc khô, mệt lả.',
    question: 'Mục tiêu chăm sóc phù hợp nhất?',
    options: [
      'Đánh giá mất nước, theo dõi điện giải và hỗ trợ bù dịch theo y lệnh',
      'Khuyên bệnh nhân nhịn ăn hoàn toàn 24 giờ',
      'Cho về nhà vì nôn ở thai kỳ đầu là bình thường',
      'Chỉ dùng thuốc bổ sung sắt',
    ],
    answer: 0,
    rationale:
      'Nôn nhiều có thể gây mất nước và rối loạn điện giải, cần đánh giá và điều trị hỗ trợ sớm.',
  },
  {
    title: 'Nghi nhiễm trùng hậu sản',
    context:
      'Ngày thứ 3 sau sinh, sản phụ sốt 38.7°C, sản dịch hôi, đau hạ vị.',
    question: 'Ưu tiên của hộ sinh?',
    options: [
      'Theo dõi thêm tại nhà 2 ngày',
      'Báo bác sĩ, lấy dấu hiệu sinh tồn định kỳ và hỗ trợ làm xét nghiệm cần thiết',
      'Khuyên bệnh nhân tự mua kháng sinh',
      'Ngưng hoàn toàn cho con bú ngay lập tức',
    ],
    answer: 1,
    rationale:
      'Dấu hiệu gợi ý nhiễm trùng hậu sản cần được đánh giá và điều trị y khoa kịp thời để tránh biến chứng.',
  },
  {
    title: 'Tư vấn thai phụ thiếu máu',
    context:
      'Thai 24 tuần, Hb 9.5 g/dL, mệt, da niêm nhợt nhẹ, chưa tuân thủ bổ sung sắt đều.',
    question: 'Can thiệp giáo dục sức khỏe phù hợp?',
    options: [
      'Giải thích tầm quan trọng của bổ sung sắt/acid folic và hướng dẫn chế độ ăn giàu sắt',
      'Ngừng mọi hoạt động thể chất và nằm nghỉ tuyệt đối',
      'Không cần theo dõi lại Hb',
      'Chỉ uống canxi liều cao',
    ],
    answer: 0,
    rationale:
      'Thiếu máu thai kỳ cần giáo dục tuân thủ bổ sung vi chất và dinh dưỡng, đồng thời theo dõi đáp ứng điều trị.',
  },
  {
    title: 'Tư vấn nuôi con bằng sữa mẹ sớm',
    context:
      'Sau sinh thường 1 giờ, mẹ ổn định, bé đủ tháng khỏe, gia đình hỏi khi nào cho bú.',
    question: 'Khuyến nghị đúng nhất?',
    options: [
      'Cho bú càng sớm càng tốt trong giờ đầu sau sinh khi mẹ-bé ổn định',
      'Đợi 24 giờ sau sinh rồi mới cho bú',
      'Cho bé uống nước đường trước 2 ngày đầu',
      'Không cần hướng dẫn tư thế ngậm bắt vú',
    ],
    answer: 0,
    rationale:
      'Cho bú sớm giúp tăng gắn kết mẹ-con, hỗ trợ tiết sữa và có lợi cho sức khỏe sơ sinh.',
  },
]

function buildRandomizedCases() {
  return [...caseTemplates]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((item, idx) => ({ ...item, id: idx + 1 }))
}

function App() {
  const [cases, setCases] = useState(() => buildRandomizedCases())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(CASE_TIME_LIMIT)
  const [confidence, setConfidence] = useState(3)

  useEffect(() => {
    if (submitted || secondsLeft <= 0) return

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentIndex, submitted, secondsLeft])

  const currentCase = cases[currentIndex]
  const timedOut = secondsLeft === 0
  const timerPercent = Math.max(0, Math.round((secondsLeft / CASE_TIME_LIMIT) * 100))

  const confidenceLabel = useMemo(() => {
    if (confidence <= 2) return 'Thấp'
    if (confidence === 3) return 'Trung bình'
    return 'Cao'
  }, [confidence])

  const handleSubmit = () => {
    if (selected === null || submitted) return
    setSubmitted(true)
  }

  const handleRetry = () => {
    setSelected(null)
    setSubmitted(false)
    setSecondsLeft(CASE_TIME_LIMIT)
    setConfidence(3)
  }

  const handleNext = () => {
    if (currentIndex === cases.length - 1) return
    setCurrentIndex((prev) => prev + 1)
    setSelected(null)
    setSubmitted(false)
    setSecondsLeft(CASE_TIME_LIMIT)
    setConfidence(3)
  }

  const handleResetAll = () => {
    setCases(buildRandomizedCases())
    setCurrentIndex(0)
    setSelected(null)
    setSubmitted(false)
    setSecondsLeft(CASE_TIME_LIMIT)
    setConfidence(3)
  }

  const isCorrect = selected === currentCase.answer
  const showResult = submitted || timedOut

  useEffect(() => {
    if (!submitted || !isCorrect) return

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#16a34a', '#f59e0b'],
    })
  }, [submitted, isCorrect, currentIndex])

  return (
    <main className="app">
      <header>
        <h1>CEM Midwife - Demo ca lâm sàng</h1>
        <p>
          Bản demo đơn giản (không login, không database) để kiểm thử luồng học qua
          tình huống.
        </p>
      </header>

      <section className="panel hero">
        <img
          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80"
          alt="Điều dưỡng hỗ trợ chăm sóc thai phụ"
        />
        <small>
          Ảnh minh hoạ miễn phí từ Unsplash để demo giao diện học trực quan hơn.
        </small>
      </section>

      <section className="panel topbar">
        <div>
          <strong>Ca:</strong> {currentCase.id}/{cases.length} - {currentCase.title}
        </div>
        <div className={secondsLeft <= 10 ? 'timer timer-danger' : 'timer'}>
          ⏱ {secondsLeft}s
        </div>
        <div className="timer-track" aria-label="Tiến độ thời gian còn lại">
          <div
            className={`timer-fill ${secondsLeft <= 10 ? 'danger' : ''}`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </section>

      <section className="panel">
        <h2>Bối cảnh</h2>
        <p>{currentCase.context}</p>
      </section>

      <section className="panel">
        <h2>Câu hỏi</h2>
        <p>{currentCase.question}</p>

        <div className="options">
          {currentCase.options.map((option, idx) => (
            <label key={idx} className={`option ${selected === idx ? 'active' : ''}`}>
              <input
                type="radio"
                name={`case-${currentCase.id}`}
                checked={selected === idx}
                onChange={() => setSelected(idx)}
                disabled={showResult}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="confidence-box">
          <label htmlFor="confidence-slider">
            Độ tự tin trước khi nộp: <strong>{confidence}/5 ({confidenceLabel})</strong>
          </label>
          <input
            id="confidence-slider"
            type="range"
            min="1"
            max="5"
            value={confidence}
            onChange={(event) => setConfidence(Number(event.target.value))}
            disabled={showResult}
          />
        </div>

        <div className="actions">
          <button onClick={handleSubmit} disabled={selected === null || submitted || timedOut}>
            Nộp bài
          </button>
          <button onClick={handleRetry} className="secondary">
            Làm lại ca này
          </button>
          <button onClick={handleNext} className="secondary" disabled={currentIndex === cases.length - 1}>
            Ca tiếp theo
          </button>
          <button onClick={handleResetAll} className="ghost">
            Tạo bộ ca mới
          </button>
        </div>
      </section>

      {showResult && (
        <section className="panel result">
          {timedOut && !submitted ? (
            <p className="wrong">Hết thời gian. Bạn có thể làm lại ca này.</p>
          ) : isCorrect ? (
            <p className="correct">✅ Chính xác! (Demo: sau này có thể cộng điểm)</p>
          ) : (
            <p className="wrong">❌ Chưa đúng. Bạn có thể làm lại để cải thiện kết quả.</p>
          )}
          <p>
            <strong>Độ tự tin bạn chọn:</strong> {confidence}/5 ({confidenceLabel})
          </p>
          <p>
            <strong>Giải thích:</strong> {currentCase.rationale}
          </p>
        </section>
      )}

      <footer>
        <small>
          Nội dung ca được tạo mẫu theo bối cảnh chăm sóc thai kỳ/hộ sinh (mang tính học tập,
          không thay thế chỉ định chuyên môn).
        </small>
      </footer>
    </main>
  )
}

export default App
