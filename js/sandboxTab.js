// handle carousel

$(function () {
  var photoTab = $("#sandboxPhoto");
  var photoEle = $(".sandbox_photography");
  var codeTab = $("#sandboxCoding");
  var codeEle = $(".sandbox_code");
  var designTab = $("#sandboxDesign");
  var motionTab = $("#sandboxMotion");

  var comingSoon = $("#sandbox_comingSoon");

  photoTab.click(function () {
    photoTab.addClass("active");
    codeTab.removeClass("active");
    designTab.removeClass("active");
    motionTab.removeClass("active");

    photoEle.css({ display: "block" });
    comingSoon.css({ display: "none" });
    codeEle.css({ display: "none" });
  });
  codeTab.click(function () {
    codeTab.addClass("active");
    photoTab.removeClass("active");
    designTab.removeClass("active");
    motionTab.removeClass("active");

    photoEle.css({ display: "none" });
    codeEle.css({ display: "block" });
    comingSoon.css({ display: "none" });
  });
  designTab.click(function () {
    designTab.addClass("active");
    codeTab.removeClass("active");
    photoTab.removeClass("active");
    motionTab.removeClass("active");

    photoEle.css({ display: "none" });
    codeEle.css({ display: "none" });
    comingSoon.css({ display: "block" });
  });
  motionTab.click(function () {
    motionTab.addClass("active");
    codeTab.removeClass("active");
    photoTab.removeClass("active");
    designTab.removeClass("active");

    photoEle.css({ display: "none" });
    codeEle.css({ display: "none" });
    comingSoon.css({ display: "block" });
  });
});
