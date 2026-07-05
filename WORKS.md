# 26.07.04 문서 작업 : 1단계

docs/guide/getting-started
docs/guide/core-concepts

위 두 경로에 있는 문서들이 아직 미완성 상태입니다.
`(설명)`으로 감싼 부분은 들어가야 하는 내용에 대한 간단한 설명입니다.

당신의 역할은 이미 작성된 문서를 리뷰하고 내용을 채워넣는 것입니다.

- 이미 잡아둔 헤드라인 내에서만 문서를 채워주세요.
- 명확하고 정확하고, 간결한 내용만 작성해주세요. 불필요한 첨언은 생략해주세요.
- https://technical-writing.dev/tutorial/review-prompt.html 테크니컬 라이팅 기술을 참고하여 작성해주세요.
- `.mdx`에는 영문을, `.ko.mdx`에는 한글로 작성합니다.
- 이미 한글로 작성이 완료된 문서가 있다면, 영문 문서에 번역해서 기입해주세요.
- OTA는 "원격"으로 번역해주세요.

# 26.07.05 문서 작업 : 2단계

content/docs/guide/frontend/**
content/docs/guide/native/**

이제 웹뷰 번들을 개발하는 단계에서 실질적인 가이드를 적을 예정입니다.
위 두 경로의 문서들은 아래 내용을 포함해야 합니다.
(파일명 - 대주제 - 섹션별 세부항목)

- 네이티브
  - index - 웹뷰 번들을 설치하기 위한 설정 : 패키지 설치, 요구사항, 시작하는 법(wvb 인스턴스 생성), Bundle Protocol / Source / Remote / Updater 설정법, 브릿지 노출방법, 이후 웹뷰를 띄우는 동작까지
  - local-development - 로컬 개발환경 설정 : Local Protocol 설정으로 로컬 개발 서버를 웹뷰에 띄워서 개발하는 방법
  - builtin - 빌트인 번들 설치 : 앱을 패키징할 때 빌트인 번들을 설치하는 방법 설명 / 리모트에서 다운받아 설치 / 로컬 파일을 설치
- 프론트엔드
  - packing - 번들 패키징 : 번들 패키징을 위한 설정 방법
  - development - 개발 서버 띄워서 네이티브에서 개발 : Local Protocol 설정으로 로컬 개발 서버를 웹뷰에 띄우는 방법
  - upload - 웹뷰 번들 업로드 하기 : 배포할 버전의 웹뷰 번들을 리모트에 업로드 하기
  - deploy - 웹뷰 번들 배포하기 : 업르도된 웹뷰 번들을 현재 버전을 배포하기
  - bridges
    - index - 브릿지 설명 : 브릿지 패키지 설명 / 브릿지의 역할 및 제공하는 기능
    - checkout-sources - Source 브릿지 사용법 : 번들 소스 유즈케이스 설명
    - update-remote-bundles - Updater 브릿지 사용법 : 브릿지를 사용하여 리모트에서 원격으로 새 웹뷰 번들을 다운받고 설치하는 방법 설명
    - testing - 테스트 방법 : 브릿지를 테스트하는 방법 설명 / mockInvoke 사용법

문장의 어투는 기존 content/docs/getting-started, content/docs/core-concepts 에 있는 문서를 참고해주시고,
간결하고 정확하게, 그리고 불필요한 내용이 거의 없게 (no verbose) 작성해주세요. 살은 제가 붙이겠습니다.

API에 대한 자세한 스펙은 소스코드를 참고해주세요.

- webview-bundle : /Users/seokju.me/workspaces/webview-bundle
- android : /Users/seokju.me/workspaces/webview-bundle-android
- ios : /Users/seokju.me/workspaces/webview-bundle-ios

다른 참고할 레퍼런스 문서

- Tauri : https://tauri.app/develop/
- Capacitor : https://capacitorjs.com/docs
- Expo : https://docs.expo.dev/

# 26.07.05 문서 작업 : 3단계

위치 : content/docs/guide/remote/\*\*

이제 리모트 구성 및 리모트로부터 신규 웹뷰 번들을 안전하게 다운받아 설치하는 Over-The-Air를 사용하는 방법에 대한 가이드 문서를 작성하겠습니다.

- remote
  - index.mdx : 리모트가 왜 필요한지랑 목적에 대해서 간단하게 설명합니다. CLI로 리모트를 사용하는 방법, Providers를 사용하여 리모트 구성하는 방법에 대해 설명합니다.
  - using-cli.mdx : CLI를 사용하여 리모트를 구성하고 신규 웹뷰 번들을 다운받아 설치하는 방법에 대한 가이드 문서입니다.
  - providers
    - aws.mdx : AWS에 리모트 서버를 구축하는 방법에 대한 가이드 (`@wvb/remote-aws-provider`) / 클라이언트에서 리모트 사용을 위한 가이드 (`@wvb/remote-aws`)
    - cloudflare.mdx : Cloudflare에 리모트 서버를 구축하는 방법에 대한 가이드 (`@wvb/remote-cloudflare-provider`) / 클라이언트에서 리모트 사용을 위한 가이드 (`@wvb/remote-cloudflare`)
    - local.mdx : 로컬에 리모트 서버를 구축하는 방법에 대한 가이드 (`@wvb/remote-local-provider`) / 클라이언트에서 리모트 사용을 위한 가이드 (`@wvb/remote-local`)
  - http-spec
    - index.mdx : 직접 리모트 서버를 구축할 때 HTTP 스펙에 대한 가이드입니다.
    - endpoints
      - (각 엔트리 포인트 별로 문서가 생성되고, OpenAPI 스펙과 유사한 디자인으로 문서를 만들어주세요.)
    - errors.mdx : 리모트 서버에서 발생하는 에러에 대한 가이드입니다.

문장의 어투는 기존 content/docs/getting-started, content/docs/core-concepts 에 있는 문서를 참고해주시고,
간결하고 정확하게, 그리고 불필요한 내용이 거의 없게 (no verbose) 작성해주세요. 살은 제가 붙이겠습니다.

---

API에 대한 자세한 스펙은 소스코드를 참고해주세요.

- webview-bundle : /Users/seokju.me/workspaces/webview-bundle
- android : /Users/seokju.me/workspaces/webview-bundle-android
- ios : /Users/seokju.me/workspaces/webview-bundle-ios

다른 참고할 레퍼런스 문서

- Tauri : https://tauri.app/develop/
- Capacitor : https://capacitorjs.com/docs
- Expo : https://docs.expo.dev/

# 26.07.05 문서 작업 : 4단계

References 문서 자동화를 구축합니다. 각 언어별 패키지들의 레퍼런스 문서화 전략은 다음과 같습니다.

- JavaScript
  - 리포지토리 https://github.com/webview-bundle/webview-bundle 에서 각 패키지 TypeScript + JSDoc 기반으로 레퍼런스 자동 생성
- Rust : docs.rs 링크 external 처리
- Android : javadoc.io 링크 external 처리
  - 리포지토리 : https://github.com/webview-bundle/webview-bundle-android
  - 소스 코드 : /Users/seokju.me/workspaces/webview-bundle-android
- iOS : swift package index 링크 external 처리
  - 리포지토리 : https://github.com/webview-bundle/webview-bundle-ios
  - 소스 코드 : /Users/seokju.me/workspaces/webview-bundle-ios

JavaScript 패키지들의 레퍼런스 문서 자동화는 다음과 같이 동작을 설계합니다.

1. https://github.com/webview-bundle/webview-bundle 리포지토리에서 release 워크플로가 실행되고 이후 결과가 이 리포지토리(webview-bundle/website)로 dispatch event
2. 이벤트를 받은 이후, latest 패키지들 기준으로 TypeScript + JSDoc 기반으로 레퍼런스 자동 생성
3. 이후, 변경된 레퍼런스 정보를 신규 브랜치에서 커밋하여 PR을 자동 생성합니다.
