# 웹뷰 번들이란?

---

웹뷰 번들은 웹뷰 기반 프레임워크 및 플랫폼을 위한 "오프라인 우선(Offline First)" 방식의 웹 애플리케이션 배포 시스템입니다.

웹 애플리케이션 코드를 네트워크를 통해 불러와 웹뷰에 런더하는 대신, 웹뷰 번들 파일(`.wvb`)로 패킹하여 로컬에서 리소스를 불러와 웹뷰에 렌더합니다. 또한, 리모트를 구성하여 원격으로 웹뷰 번들을 다운받아 최신상태의 애플리케이션 코드를 네이티브 배포 없이 효과적으로 업데이트할 수 있습니다.

웹뷰 번들은 웹뷰가 제공되는 [Electron](https://electronjs.org), [Tauri](https://tauri.app), Android, iOS, 그리고 [Deno Desktop](https://deno.com/blog/v2.9#deno-desktop)(실험적)을 지원하며, 웹뷰와 통신할 수 있는 [브릿지](...) 또한 제공됩니다.

## 기능

### 네이티브에 웹을 탑재

웹뷰 번들을 이용하면 익숙한 프론트엔드 코드를 네이티브에 탑재하여 오프라인에서 동작하는 애플리케이션을 만들 수 있습니다. 이를 지원하기 위해 웹 애플리케이션을 웹뷰 번들(`.wvb`) 포맷으로 패킹하여, 네이티브 앱 번들에 포함시킵니다.

네이티브에서는 웹뷰의 요청을 인터셉트하여 네트워크 요청을 웹뷰 번들 파일 내의 리소스를 읽어 응답합니다. 따라서, 네트워크 요청이 인터넷을 통할 필요없이 로컬데이터를 읽어 응답하므로 오프라인에서도 웹 애플리케이션이 동작할 수 있습니다.

### OTA(Over-the-air)

네이티브 앱 번들에 포함된 번들을 최신 상태로 업데이트하기 위해 웹뷰 번들 시스템은 OTA 기술을 제공합니다. [리모트](...) 제공자를 만들어 배포할 번들을 업로드할 수 있고, 프론트엔드 혹은 네이티브에서 원하는 타이밍에 신규 번들을 다운받아 최신 상태를 유지할 수 있습니다.

웹뷰 번들을 원격으로 업데이트하는 과정은 네이티브 앱 배포 혹은 앱 재시작없이 수행되기에 UX를 해치지 않고 최신 상태를 유지할 수 있습니다. 예를들어, Electron은 업데이트 하려면 수십MB를 다운받고 앱을 재시작해야 업데이트가 반영되는데, 웹뷰 번들을 이용하면 이 과정을 생략할 수 있습니다.

### 멀티 플랫폼 지원

웹뷰 번들 코어는 Rust로 작성되었으며 여러 플랫폼에 호환가능하게 빌드됩니다.

- Node.js : [napi.rs](https://napi.rs/)를 이용해 [네이티브 애드온](https://nodejs.org/api/n-api.html)을 만들어 사용합니다.
- Android, iOS : [uniffi](https://github.com/mozilla/uniffi-rs)로 kotlin/swift 바인딩을 생성합니다.
- Deno : [Deno FFI](https://docs.deno.com/runtime/fundamentals/ffi/) API를 이용해 동적 라이브러리를 링킹하여 사용합니다.

## 리소스

이 [가이드](https://wvb.dev/guide)를 포함해

- [webview-bundle](https://github.com/webview-bundle/webview-bundle) : 웹뷰 번들 패키지 모노리포
- [webview-bundle-android](https://github.com/webview-bundle/webview-bundle-android) : 웹뷰 번들 Android 라이브러리
- [webview-bundle-ios](https://github.com/webview-bundle/webview-bundle-ios) : 웹뷰 번들 iOS 라이브러리
- playground
- AI 연동
