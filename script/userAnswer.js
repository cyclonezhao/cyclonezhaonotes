(function(){
    try{
    	// 问题块处理
    	var qaArr = document.getElementsByClassName('qa');
    	for(var i = 0; i < qaArr.length; i++){
    	    var qa = qaArr[i];
    	    var question = qa.getElementsByClassName('question')[0];
    	    var str = '<div><textarea class="userAnswer"></textarea><button class="checkAnswer">检查</button></div>';
    	    question.insertAdjacentHTML('afterend', str);
    	}

    	// 监听事件
    	var checkAnswer = function(e){
    	    var textArea = e.currentTarget.previousElementSibling;
    	    var answerPanel = e.currentTarget.parentNode.parentNode.getElementsByClassName("answer")[0];
    	    if(textArea.value == answerPanel.innerText){
    	    	textArea.setAttribute('style', 'background-color:#bef5be;');
    	    }else{
    	    	textArea.setAttribute('style', 'background-color:#ffc0c0;');
    	    }

    	};

    	var checkAnswerBtns = document.getElementsByClassName('checkAnswer');
        for(var i = 0; i < checkAnswerBtns.length; i++){
            checkAnswerBtns[i].addEventListener('click', checkAnswer);
        }
    }catch(error){
        alert(error.message);
        throw error;
    }
})();