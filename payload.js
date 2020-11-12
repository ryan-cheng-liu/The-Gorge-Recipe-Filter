function waitUntilLoadingComplete() {
  // wait dishes loading complete
  if (typeof discovered_dishes != 'undefined'
    && Object.keys(discovered_dishes).length >= 70) {
    // detect Klei merge filter into their recipe
    // so it's no need to use this extension
    if (typeof DISABLE_EXTENSION_VERSION_FILTER != 'undefined') {
      alert("Klei already merge extension 'The Gorge Recipe Filter' into their recipe book, \nso just uninstall it! :)");
      return;
    }
    //
    let e = new CustomEvent('TGRF', {
      detail: { discovered_dishes }
    });
    dispatchEvent(e);
    SelectDish = () => {} // use ours display function
  } else {
    // keep waiting
    setTimeout(waitUntilLoadingComplete, 1000);
  }
}
waitUntilLoadingComplete();
