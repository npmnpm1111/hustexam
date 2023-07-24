(function() {
    var quizzes = {
        ktmt: [
            // các câu hỏi hiện tại...
            {
                type: "multiple_choice",
                question: "Thanh ghi nào có giá trị cố định, không thay đổi trong khi chạy chương trình?",
                answers: ["$at", "$zero", "$sp", "hi", "pc"],
                correctAnswer: 1
            },
            {
                type: "multiple_choice",
                question: "Trong ứng dụng Mars, khi dịch từ mã nguồn sang mã cơ bản, những công việc nào sau đây sẽ được thực hiện? (có thể chọn nhiều đáp án)",
                answers: ["Chuyển các nhãn thành địa chỉ", "Chuyển các thanh ghi từ tên sang số hiệu", "Chuyển các hằng số từ hệ thập phân sang hệ thập lục phân", "Thay thế giả lệnh bằng các lệnh cơ bản"],
                correctAnswer: [0, 1, 2, 3] // Giả sử tất cả các đáp án đều đúng
            },
            {
                type: "fill_in",
                question: "Giá trí của thanh ghi $a0 sau khi đoạn chương trình dưới được thực hiện là bao nhiêu? (điền số ở hệ thập phân).\n.text\n\tli $a0, 0\n\tli $a1, 0\n\tli $a2, 5\nl1:\n\tbeq $a1, $a2, end\n\tadd $at, $a1, $s1\n\tadd $a0, $a0, $at\n\taddi $ai, $ai, 1\n\tj l1\nend:",
                correctAnswer: "thật à" // Thay "Đáp án" bằng đáp án thực tế của bạn
            },
            {
                type: "fill_in",
                question: "Đoạn chương trình sau in chuỗi ký tự gì ra màn hình Run I/O?\n.text\n\tli $a1, 0\n\tli $a2, 5\n\tli $v0, 11\nl1:\n\tbeq $a1, $a2, end\n\taddi $a0, $a1, 49\n\tsyscall \n\taddi $a1, $a1, 1\n\tj li\nend:",
                correctAnswer: "địt cụ" // Thay "Đáp án" bằng đáp án thực tế của bạn
            },
            {
                type: "fill_in",
                question: "Dịch lệnh sau sang mã máy (viết dưới dạng số hexa có tiền tố 0x đứng trước)\n\taddi $a1, $a1, 1",
                correctAnswer: "Đáp án" // Thay "Đáp án" bằng đáp án thực tế của bạn
            },
            // thêm thêm câu hỏi...
        ],
        
    };

    var currentQuiz = null;

    function displayQuiz() {
        var quizDiv = document.getElementById("quiz");
        quizDiv.innerHTML = "";
        for (var i = 0; i < currentQuiz.length; i++) {
            var question = currentQuiz[i];
            var questionDiv = document.createElement("div");
            var questionText = document.createElement("p");
            questionText.textContent = (i + 1) + ". " + question.question.split("\n")[0]; // Thêm số thứ tự cho câu hỏi
            questionDiv.appendChild(questionText);
            if (question.question.includes("\n")) {
                var codeBlock = document.createElement("pre");
                var code = document.createElement("code");
                code.textContent = question.question.split("\n").slice(1).join("\n");
                codeBlock.appendChild(code);
                questionDiv.appendChild(codeBlock);
            }
            if (question.type === "multiple_choice") {
                for (var j = 0; j < question.answers.length; j++) {
                    var answer = question.answers[j];
                    var answerInput = document.createElement("input");
                    answerInput.type = "radio";
                    answerInput.name = "question" + i;
                    answerInput.value = j;
                    var answerLabel = document.createElement("label");
                    answerLabel.textContent = String.fromCharCode(65 + j) + ". " + answer; // Thêm số thứ tự cho đáp án
                    questionDiv.appendChild(answerInput);
                    questionDiv.appendChild(answerLabel);
                    questionDiv.appendChild(document.createElement("br")); // Thêm một dòng mới sau mỗi đáp án
                }
            } else if (question.type === "fill_in") {
                var answerInput = document.createElement("input");
                answerInput.type = "text";
                answerInput.name = "question" + i;
                questionDiv.appendChild(answerInput);
            }
            quizDiv.appendChild(questionDiv);
        }
    }
    
    
    
    function showConfirmModal(message, confirmCallback) {
        var modal = document.getElementById("confirmModal");
        var span = document.getElementsByClassName("close")[0];
        var yesButton = document.getElementById("confirmModalYes");
        var noButton = document.getElementById("confirmModalNo");
        document.getElementById("confirmModalText").innerText = message;
        modal.style.display = "block";
        yesButton.onclick = function() {
            confirmCallback();
            modal.style.display = "none";
        }
        noButton.onclick = function() {
            modal.style.display = "none";
        }
    }
    
    function showWarningModal(message, confirmCallback) {
        var modal = document.getElementById("warningModal");
        var span = document.getElementsByClassName("close")[1];
        var yesButton = document.getElementById("warningModalYes");
        var noButton = document.getElementById("warningModalNo");
        document.getElementById("warningModalText").innerText = message;
        modal.style.display = "block";
        yesButton.onclick = function() {
            confirmCallback();
            modal.style.display = "none";
        }
        noButton.onclick = function() {
            modal.style.display = "none";
        }
    }
    
    
    function submitQuiz() {
        var score = 0;
        var result = [];
        var unanswered = false;
        for (var i = 0; i < currentQuiz.length; i++) {
            var question = currentQuiz[i];
            var answerInputs = document.getElementsByName("question" + i);
            var answer = null;
            if (question.type === "multiple_choice") {
                for (var j = 0; j < answerInputs.length; j++) {
                    if (answerInputs[j].checked) {
                        answer = j;
                        break;
                    }
                }
            } else if (question.type === "fill_in") {
                answer = answerInputs[0].value;
            }
            if (answer === null || answer === "") {
                unanswered = true;
                console.log("Câu hỏi " + (i + 1) + " chưa được trả lời.");
            }
            if (answer == question.correctAnswer) {
                score++;
            }
            result.push({
                question: question.question,
                correctAnswer: question.correctAnswer,
                userAnswer: answer !== null ? answer : null
            });
        }
    
        if (unanswered) {
            showWarningModal("Còn câu hỏi chưa được trả lời! Bạn có muốn vẫn nộp bài?", function() {
                // Nộp bài dù có câu chưa trả lời
                console.log("Nộp bài dù có câu chưa trả lời");
                localStorage.setItem('myUniqueKey', JSON.stringify({ result: result, score: score }));
                window.location.href = 'result.html'; // Thay thế hàm showModal
            });
        } else {
            showConfirmModal("Bạn đã hoàn thành tất cả câu hỏi. Bạn có chắc chắn muốn nộp bài?", function() {
                // Nộp bài
                console.log("Nộp bài");
                localStorage.setItem('myUniqueKey', JSON.stringify({ result: result, score: score }));
                window.location.href = 'result.html'; // Thay thế hàm showModal
            });
        }
    }
    

    var urlParams = new URLSearchParams(window.location.search);
    var quizId = urlParams.get('quiz');
    if (quizId && quizzes[quizId]) {
        currentQuiz = quizzes[quizId];
        displayQuiz();
    }

    // Expose the functions to the global scope
    window.displayQuiz = displayQuiz;
    window.submitQuiz = submitQuiz;
})();












