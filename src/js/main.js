import '../css/style.scss'
import * as THREE from "three";
import barba from '@barba/core';
import { gsap, Circ } from "gsap";
import vertexSource from "./shader/vertexShader.glsl";
import fragmentSource from "./shader/fragmentShader.glsl";
import { replaceHead } from './replace';
import { radian } from './utils';


class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas = document.querySelector("#canvas");
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.cameraFov = 45;
    this.cameraFovRadian = (this.cameraFov / 2) * (Math.PI / 180);
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian);
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.group = new THREE.Group();

    this.uniforms = {
      uTime: {
        value: 0.0
      },
      // uTex: {
      //   value: this.texture
      // },
      // uResolution: {
      //   value: new THREE.Vector2(this.viewport.width, this.viewport.height)
      // },
      // uTexResolution: {
      //   value: new THREE.Vector2(2048, 1024)
      // },
      //振幅
      uPower: {
        value: 0.0
      },
      //周波数
      uFrequency: {
        // value: 3.0
        // value: new THREE.Vector2(4, 6)
        value: new THREE.Vector3(4, 4, 4)
      }
    };

    this.clock = new THREE.Clock();

    this.init();
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  _setCamera() {
    //ウインドウとWebGL座標を一致させる
    this.camera = new THREE.PerspectiveCamera(this.cameraFov, this.viewport.width / this.viewport.height, 1, this.cameraDistance * 2);
    this.camera.position.z = this.cameraDistance;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  _setLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1);
    this.scene.add(light);
  }

  _addMesh() {
    // //ジオメトリ
    // this.geometry = new THREE.PlaneGeometry(this.viewport.width, this.viewport.height, 40, 40);

    // //テクスチャ
    // const loader = new THREE.TextureLoader();
    // this.uniforms.uTex.value = loader.load(img);

    // console.log(this.texture);

    // //マテリアル
    // this.material = new THREE.ShaderMaterial({
    //   uniforms: this.uniforms,
    //   vertexShader: vertexSource,
    //   fragmentShader: fragmentSource,
    //   side: THREE.DoubleSide
    // });

    // //メッシュ
    // this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.mesh);

    //ジオメトリ
    this.geometry = new THREE.SphereGeometry(280, 80, 80);


    //マテリアル
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
      side: THREE.DoubleSide
    });

    //メッシュ
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.group.add(this.mesh);
  }

  init() {
    this.scene.add(this.group);
    this._setRenderer();
    this._setCamera();
    this._setLight();
    this._addMesh();

    this._update();
    this._addEvent();
  }

  _update() {
    const elapsedTime = this.clock.getElapsedTime();
    this.uniforms.uTime.value = elapsedTime * 0.03;

    //レンダリング
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this._update.bind(this));
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
    // カメラの位置を調整
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian); //ウインドウぴったりのカメラ距離
    this.camera.position.z = this.cameraDistance;
    // uniforms変数に反映
    this.mesh.material.uniforms.uResolution.value.set(this.viewport.width, this.viewport.height);
    // meshのscale設定
    const scaleX = Math.round(this.viewport.width / this.mesh.geometry.parameters.width * 100) / 100 + 0.01;
    const scaleY = Math.round(this.viewport.height / this.mesh.geometry.parameters.height * 100) / 100 + 0.01;
    this.mesh.scale.set(scaleX, scaleY, 1);
  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }


  anim01() {
    const tl = gsap.timeline();
    tl.to(this.group.rotation, {
      y: radian(0),
      duration: 0.8,
      ease: Circ.easeInOut,
    })
    .to(this.uniforms.uPower, {
      value: 0.0,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')
  }

  anim02() {
    // const tl = gsap.timeline({ repeat: -1 });
    const tl = gsap.timeline();
    tl.to(this.group.rotation, {
      y: radian(360),
      duration: 0.8,
      ease: Circ.easeInOut,
    })
    .to(this.uniforms.uPower, {
      value: 50.0,
      duration: 0.8,
      ease: Circ.easeInOut,
    }, '<')
  }

  anim03() {
    tl.to(this.group.rotation, {
      y: radian(0),
      duration: 0.8,
      ease: Circ.easeInOut,
    })
  }
}

const main = new Main();



barba.init({
  sync: true,
  // transitions: [{
  //   name: 'default-transition',
  //   leave(data) {
  //     return gsap.to(data.current.container, {
  //       opacity: 0
  //     });
  //   },
  //   enter(data) {
  //     return gsap.from(data.next.container, {
  //       opacity: 0
  //     });
  //   }
  // }],
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        main.anim01();
      }
    },
    {
      namespace: 'page2',
      beforeEnter() {
        main.anim02();
      }
    },
    {
      namespace: 'page3',
      beforeEnter() {
        main.anim03();
      }
    }
  ]
});

barba.hooks.beforeEnter((data) => {
  replaceHead(data);
});
