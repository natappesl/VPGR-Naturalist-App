// Singleton Reference: https://www.sitepoint.com/javascript-design-patterns-singleton/



class MediaService {
  constructor () {
    if (!MediaService.instance) {
      MediaService.instance = this;
      MediaService.instance.loadImages();
    }

    return MediaService.instance;
  }

  loadImages() {

  }
}

const instance = new MediaService ();
Object.freeze(instance);

export default instance;