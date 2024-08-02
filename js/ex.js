(() => {
  let Yoffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  let enterNewScene = false;

  const sceneInfo = [
    {
      type: "sticky",
      heightNum: 7,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 150,
        imageSeqence: [0, 151], //이미지순서
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], //투명도 0부터 1까지. 시작과 끝 그리고.. 0.2 - 0.1 = 0.1 즉 10퍼센트 구간만 ㅇㅇ {}은 3번째 인덱스
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }], //scrollHeight이 1이라고 쳤을때의 비율임 ab 구간은 같음 10퍼.
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    {
      type: "nomal",
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
  ];

  function setCanvasImage() {
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      let imgElem = new Image(); //imgElem에 이미지 객체가 할당
      imgElem.src = `../video/winter (${71 + i}).jpg`; //해당 경로의 이미지를 로드
      sceneInfo[0].objs.videoImages.push(imgElem); //imgElem를 sceneInfo[0].objs.videoImages 배열에 추가
    }
  }
  setCanvasImage();

  //각 장면의 스크롤 높이 설정
  function setLayout() {
    for (i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight; //컨텐츠의 높이로
      }
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    Yoffset = window.scrollY;

    let totalscrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalscrollHeight += sceneInfo[i].scrollHeight;
      if (totalscrollHeight >= Yoffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0)scale(${heightRatio})`;
  }

  //현재씬비율구하기
  function calcValues(values, currentYScrollSet) {
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight; //현재씬의 스크롤 높이
    const scrollRatio = currentYScrollSet / scrollHeight; //현재 내가 스크롤한 값에 현재씬의 스크롤의 높이를 나눔

    if (values.length === 3) {
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYScrollSet >= partScrollStart &&
        currentYScrollSet <= partScrollEnd
      ) {
        rv =
          ((currentYScrollSet - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYScrollSet < partScrollStart) {
        rv = values[0];
      } else if (currentYScrollSet > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }
    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYScrollSet = Yoffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYScrollSet / scrollHeight;

    switch (currentScene) {
      case 0:
        let seqence = Math.round(
          calcValues(values.imageSeqence, currentYScrollSet)
        );

        objs.context.drawImage(objs.videoImages[seqence], 0, 0);
        objs.canvas.style.opacity = calcValues(
          values.canvas_opacity,
          currentYScrollSet
        );

        if (scrollRatio <= 0.22) {
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYScrollSet
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            0,
            values.messageA_translateY_in,
            currentYScrollSet
          )}%, 0)`;
        } else {
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYScrollSet
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            0,
            values.messageA_translateY_out,
            currentYScrollSet
          )}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYScrollSet
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            0,
            values.messageB_translateY_in,
            currentYScrollSet
          )}%, 0)`;
        } else {
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYScrollSet
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            0,
            values.messageB_translateY_out,
            currentYScrollSet
          )}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYScrollSet
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            0,
            values.messageC_translateY_in,
            currentYScrollSet
          )}%, 0 )`;
        } else {
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYScrollSet
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            0,
            values.messageC_translateY_out,
            currentYScrollSet
          )}%, 0 )`;
        }

        if (scrollRatio <= 0.82) {
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_in,
            currentYScrollSet
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            0,
            values.messageD_translateY_in,
            currentYScrollSet
          )}%, 0 )`;
        } else {
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_out,
            currentYScrollSet
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            0,
            values.messageD_translateY_out,
            currentYScrollSet
          )}%, 0 )`;
        }

        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (Yoffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (Yoffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;
    playAnimation();
  }




  //실행 함수?
  window.addEventListener("scroll", () => {
    Yoffset = window.scrollY;
    scrollLoop();
  });
  window.addEventListener("load", () => {
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
  });
  window.addEventListener("resize", setLayout);
  setLayout();


})();







// 모든 .d1-a 요소들을 선택
const aboutLinks = document.querySelectorAll(".d1-a");

// 모든 .gnb-draw 요소들을 선택
const gnbDraws = document.querySelectorAll(".gnb-draw");

const header = document.querySelector(".header");

// .d1-a 요소들과 .gnb-draw 요소들을 짝지어 처리
aboutLinks.forEach((link, index) => {
  const gnbDraw = gnbDraws[index];

  // 해당 .d1-a 요소에 마우스 진입 이벤트 핸들러 추가
  link.addEventListener("mouseenter", () => {
    // 모든 gnbDraw 숨기기
    gnbDraws.forEach((draw) => {
      draw.style.visibility = "hidden";
      draw.style.opacity = "0";
    });

    // 현재 요소에 해당하는 gnbDraw만 보이기
    gnbDraw.style.visibility = "inherit";
    gnbDraw.style.opacity = "1";
  });

  header.addEventListener("mouseleave", () => {
    gnbDraw.style.visibility = "hidden";
    gnbDraw.style.opacity = "0";
  });
});





var header1 = document.querySelector(".header");

// 헤더의 초기 위치 저장
var sticky = header1.offsetTop;

// 스크롤 이벤트 핸들러 추가
window.onscroll = function () {
  const currentScrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;

  if (currentScrollTop >= sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
};

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 50 ||
    document.documentElement.scrollTop > 50
  ) {
    document.querySelector(".header").classList.add("fixed");
  } else {
    document.querySelector(".header").classList.remove("fixed");
  }
}



