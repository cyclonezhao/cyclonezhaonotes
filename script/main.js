(function(){
    try{
        var toc = "";
        var level = 0;
        var indexCache = {'root':['root', null, 0, 0]}; // self, parent, level, reilSubIndex
        var currentIndexBox = indexCache['root'];

        var contentDom = document.getElementById("bodyContent");
        var innerHTML = contentDom.innerHTML;
        innerHTML = innerHTML.replace(
                /<h([\d])>([^<]+)<\/h([\d])>/gi,
                function (str, openLevel, titleText, closeLevel) {
                    if (openLevel != closeLevel) {
                        return str;
                    }

                    if (openLevel > level) {
                        toc += (new Array(openLevel - level + 1)).join("<ul>");
                    } else if (openLevel < level) {
                        toc += (new Array(level - openLevel + 1)).join("</ul>");
                    }

                    level = parseInt(openLevel);
                    var self = '';
                    if(level > currentIndexBox[2]){
                      self = (currentIndexBox[3] + 1);
                      currentIndexBox[3] = self;
                      
                      var parent = currentIndexBox[0];
                      if(parent == 'root'){
                        self = '' + self;
                      }else{
                        self = parent + '.' + self;
                      }
                      currentIndexBox = [self, parent, level, 0];
                      indexCache[self] = currentIndexBox;
                    }else if(level == currentIndexBox[2]){
                      var parentBox = indexCache[currentIndexBox[1]];
                      self = (parentBox[3] + 1);
                      parentBox[3] = self;

                      var parent = parentBox[0];
                      if(parent == 'root'){
                        self = '' + self;
                      }else{
                        self = parent + '.' + self;
                      }
                      currentIndexBox = [self, parent, level, 0];
                      indexCache[self] = currentIndexBox;
                    }else{
                      var parentBox = currentIndexBox;
                      while(true){
                        parentBox = indexCache[parentBox[1]];
                        if(level == parentBox[2]){
                          parentBox = indexCache[parentBox[1]];
                          break;
                        }
                      }

                      self = (parentBox[3] + 1);
                      parentBox[3] = self;

                      var parent = parentBox[0];
                      if(parent == 'root'){
                        self = '' + self;
                      }else{
                        self = parent + '.' + self;
                      }
                      currentIndexBox = [self, parent, level, 0];
                      indexCache[self] = currentIndexBox;
                    }

                    var anchor = titleText.replace(/ /g, "_");
                    anchor = self + ' ' + anchor;
                    toc += "<li><a href=\"#" + anchor + "\">" + self + ' ' + titleText
                        + "</a></li>";

                    return "<h" + openLevel + "><a name=\"" + anchor + "\">"
                        + self + ' ' + titleText + "</a></h" + closeLevel + ">";
                }
            );
        contentDom.innerHTML = innerHTML;

        if (level) {
            toc += (new Array(level + 1)).join("</ul>");
        }

        document.getElementById("mainNavigation").innerHTML += toc;

        // 监听事件
        var showAnswer = function(e){
            var answerPanel = e.currentTarget.parentNode.getElementsByClassName("answer")[0];
            var style = answerPanel.getAttribute('style');
            if(style){
                answerPanel.removeAttribute('style');
                e.currentTarget.innerText = "显示答案";
            }else{
                answerPanel.setAttribute('style', 'display:inherit');
                e.currentTarget.innerText = "隐藏答案";
            }

        };

        // 问题块处理
        var qaArr = document.getElementsByClassName('qa');
        for(var i = 0; i < qaArr.length; i++){
            var qa = qaArr[i];
            var question = qa.getElementsByClassName('question')[0];
            question.innerText = '问题' + (i+1) + "：" + question.innerText;
            var answer = qa.getElementsByClassName('answer')[0];
            answer.insertAdjacentHTML('afterend', '<button class="showAnswer">显示答案</button>');
        }

        var showBtns = document.getElementsByClassName('showAnswer');
        for(var i = 0; i < showBtns.length; i++){
            showBtns[i].addEventListener('click', showAnswer);
        }

    }catch(error){
        alert(error.message);
        throw error;
    }
})();