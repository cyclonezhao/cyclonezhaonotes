(function () {
  try {
    var toc = "";
    var level = 0;
    var indexCache = { 'root': ['root', null, 0, 0] }; // self, parent, level, reilSubIndex
    var currentIndexBox = indexCache['root'];

    var contentDom = document.getElementById("bodyContent");
    var innerHTML = contentDom.innerHTML;
    innerHTML = innerHTML.replace(
      /<h([\d])[^>]+>([^<]+)<\/h([\d])>/gi,
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
        if (level > currentIndexBox[2]) {
          self = (currentIndexBox[3] + 1);
          currentIndexBox[3] = self;

          var parent = currentIndexBox[0];
          if (parent == 'root') {
            self = '' + self;
          } else {
            self = parent + '.' + self;
          }
          currentIndexBox = [self, parent, level, 0];
          indexCache[self] = currentIndexBox;
        } else if (level == currentIndexBox[2]) {
          var parentBox = indexCache[currentIndexBox[1]];
          self = (parentBox[3] + 1);
          parentBox[3] = self;

          var parent = parentBox[0];
          if (parent == 'root') {
            self = '' + self;
          } else {
            self = parent + '.' + self;
          }
          currentIndexBox = [self, parent, level, 0];
          indexCache[self] = currentIndexBox;
        } else {
          var parentBox = currentIndexBox;
          while (true) {
            parentBox = indexCache[parentBox[1]];
            if (level == parentBox[2]) {
              parentBox = indexCache[parentBox[1]];
              break;
            }
          }

          self = (parentBox[3] + 1);
          parentBox[3] = self;

          var parent = parentBox[0];
          if (parent == 'root') {
            self = '' + self;
          } else {
            self = parent + '.' + self;
          }
          currentIndexBox = [self, parent, level, 0];
          indexCache[self] = currentIndexBox;
        }

        var anchor = titleText.replace(/ /g, "_");
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
    var showAnswer = function (e) {
      var question = e.currentTarget.parentNode.getElementsByClassName("question")[0];
      var answerPanel = e.currentTarget.parentNode.getElementsByClassName("answer")[0];
      var style = answerPanel.getAttribute('style');
      if (style) {
        answerPanel.removeAttribute('style');
        question.removeAttribute('style');
        e.currentTarget.innerText = "显示答案";
      } else {
        question.setAttribute('style', "font-weight: bold;");
        answerPanel.setAttribute('style', 'display:inherit');
        e.currentTarget.innerText = "隐藏答案";
      }
    };

    function createElementFromHTML(htmlString) {
      var div = document.createElement('div');
      div.innerHTML = htmlString.trim();

      // Change this to div.childNodes to support multiple top-level nodes.
      return div.firstChild;
    }

    // 问题块处理（新）
    var bodyContent = document.getElementById("bodyContent");
    var children = bodyContent.children;
    var fragment = document.createDocumentFragment();
    var answerPanel;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.innerText && child.innerText.startsWith("Q: ")) {
        var qa = createElementFromHTML("<div class='qa'></div>");
        child.className = "question";
        child.innerText = child.innerText.substring(3);
        qa.appendChild(createElementFromHTML(child.outerHTML));

        answerPanel = createElementFromHTML("<div class='answer'></div>");
        qa.appendChild(answerPanel);
        fragment.appendChild(qa);
      } else {
        if (answerPanel && child.tagName.toLowerCase() != 'h1'
          && child.tagName.toLowerCase() != 'h2'
          && child.tagName.toLowerCase() != 'h3'
          && child.tagName.toLowerCase() != 'h4'
          && child.tagName.toLowerCase() != 'h5'
          && child.tagName.toLowerCase() != 'h6'
        ) {
          answerPanel.appendChild(createElementFromHTML(child.outerHTML));
        } else {
          fragment.appendChild(createElementFromHTML(child.outerHTML));
        }
      }
    }

    bodyContent.innerHTML = "";
    bodyContent.appendChild(fragment);

    // 问题块处理
    var qaArr = document.getElementsByClassName('qa');
    for (var i = 0; i < qaArr.length; i++) {
      var qa = qaArr[i];
      var question = qa.getElementsByClassName('question')[0];
      question.innerText = '问题' + (i + 1) + "：" + question.innerText;
      var answer = qa.getElementsByClassName('answer')[0];
      answer.insertAdjacentHTML('afterend', '<button class="showAnswer">显示答案</button>');
    }

    var showBtns = document.getElementsByClassName('showAnswer');
    for (var i = 0; i < showBtns.length; i++) {
      showBtns[i].addEventListener('click', showAnswer);
    }

    // ============= 图片处理 =============
    var body = document.getElementsByTagName("body")[0];
    var innerDiv = document.getElementById("innerdiv");
    var outerDiv = document.getElementById("outerdiv");
    var viewport = getViewport();
    var windowWidth = viewport.width;
    var windowHeight = viewport.height;
    body.addEventListener("orientationchange", function(event) {
      viewport = getViewport();
      windowWidth = viewport.width;
      windowHeight = viewport.height;
      var style_str = outerDiv.getAttribute("style");
      if(!style_str.includes("display:none;")){
        var imgWidth = innerDiv.getAttribute("width");
        var imgHeight = innerDiv.getAttribute("height");
        setInnerDivSize(imgWidth, imgHeight);
      }
    });

    var imgArr = document.getElementsByTagName("img");
    for (var i = 0; i < imgArr.length; i++) {
      var img = imgArr[i];
      if (!img.getAttribute("id")) {
        var style_str = "width:100px;padding:3px;border:.5px solid #999";
        img.setAttribute("style", style_str);
        img.addEventListener("click", imgShow);
      }
    }
    // 显示大图
    outerDiv.addEventListener('click', function (e) {
      // 点击大图消失
      var style_str = outerDiv.getAttribute("style");
      style_str += "display:none;"
      outerDiv.setAttribute("style", style_str);
      // 恢复滚动条
      body.removeAttribute("style");
    });

    function imgShow(e) {
      var smallImg = e.currentTarget;
      var src = smallImg.getAttribute("src");//获取当前点击的pimg元素中的src属性
      var bigimg = document.getElementById("bigimg");
      bigimg.setAttribute("src", src);//设置#bigimg元素的src属性
      /*获取当前点击图片的真实大小，并显示弹出层及大图*/

      var imgWidth = smallImg.naturalWidth;//获取图片真实宽度
      var imgHeight = smallImg.naturalHeight;//获取图片真实高度

      // 根据设备尺寸调整
      setInnerDivSize(imgWidth, imgHeight);

      // 显示大图
      style_str = outerDiv.getAttribute("style");
      style_str = style_str.replace("display:none;", "");
      outerDiv.setAttribute("style", style_str);

      // 禁止滚动条
      body.setAttribute("style", "overflow:hidden;");
    }

    function setInnerDivSize(imgWidth, imgHeight){
      if (imgWidth > windowWidth || imgHeight > windowHeight) {
        if(windowWidth > windowHeight){
          imgHeight = imgHeight * (windowWidth / imgWidth);
          imgWidth = windowWidth;
          bigimg.setAttribute("width", imgWidth);
        }else{
          imgWidth = imgWidth * (windowHeight / imgHeight);
          imgHeight = windowHeight;
          bigimg.setAttribute("height", imgHeight);
        }
      }

      //设置#innerdiv的top和left属性
      var w = (windowWidth - imgWidth) / 2;//计算图片与窗口左边距
      var h = (windowHeight - imgHeight) / 2;//计算图片与窗口上边距
      style_str = "position:absolute;";
      style_str += "top:" + h + "px;";
      style_str += "left:" + w + "px;";
      innerDiv.setAttribute("style", style_str);
      innerDiv.setAttribute("width", imgWidth);
      innerDiv.setAttribute("height", imgHeight);
    }

    function getViewport() {
      var e = window, a = 'inner';
      if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
      }
      return { width: e[a + 'Width'], height: e[a + 'Height'] };
    }

  } catch (error) {
    alert(error.message);
    throw error;
  }
})();