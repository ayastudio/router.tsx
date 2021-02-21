<div align="center">
  <h1>📦 router.tsx</h1>
  <h2 style="border-bottom: none">⚓ Advanced React router built on TypeScript</h2>
  <p>Drop-in versatile replacement package for the basic React router, well-suited for VKUI</p>
  <a target="_blank" href="https://badge.fury.io/js/router.tsx">
    <img
      src="https://badge.fury.io/js/router.tsx.svg?maxAge=3600"
      alt="NPM package version of router.tsx, drop-in versatile replacement for the basic React router, well-suited for VKUI." />
  </a>
  <a target="_blank" href="https://npmjs.com/package/router.tsx">
    <img
      src="https://img.shields.io/npm/v/router.tsx/latest.svg?maxAge=3600"
      alt="Latest npmjs package version of router.tsx, drop-in versatile replacement for the basic React router, well-suited for VKUI." />
  </a>
  <a href="https://github.com/ayastudio/router.tsx#license">
    <img
      src="https://img.shields.io/npm/l/router.tsx?color=blue"
      alt="LICENSE for the router.tsx, drop-in versatile replacement for the basic React router, well-suited for VKUI." />
  </a>
  <a target="_blank" href="https://github.com/semantic-release/semantic-release">
    <img
      src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg"
      alt="Semantic Release enabled for the router.tsx, drop-in versatile replacement for the basic React router, well-suited for VKUI." />
  </a>

</div>

## ℹ️ About router.tsx

So, we know that there's react-router, router5 and others. But we wanted to make a simple, but
multifunctional router, which would be useful in the more specific and tough-to-manage cases. This router is specially tinkered for VKUI and it's components.

By the way, batteries (TypeScript) included.
But you can still you good ol' ES6 JavaScript, which can be compiled to the *dirs/* folder
and is already presented in the [router.tsx npm package](https://www.npmjs.com/package/router.tsx).

## 🤟 Installing

You can use either one of the main two Node.js package managers:
npm or yarn to install *router.tsx* package.

Using npm:

```bash
npm i router.tsx@latest
```

Using yarn:

```bash
yarn add router.tsx@latest
```

## 🧐 Step-by-step how-to

### 0. Hello World

Let's make a simple app with one *View* and two panels:

```jsx
const App = () => {
    return <View id="view_main" activePanel="panel_main">
        <Home id="panel_main" />
        <Doggy id="panel_doggy" />
    </View>;
};

export default App;
```

### 1. Describe the routes

In order to connect *router.tsx* to such an application it's necessary
to describe pages and apps, and what *Panel* and *View* will be on these pages.

In our case, it will look something like this:

```jsx
import { Page, Router } from 'router.tsx';

const routes = {
    '/': new Page('panel_main', 'view_main'),
    '/doggy': new Page('panel_doggy', 'view_main'),
};

const router = new Router(routes);
router.start();
```

But we can't leave it like that because strings like *panel_main* will be used
in another part of the application, so they must be replaced with constants:

```jsx
import { Page, Router } from 'router.tsx';

export const PAGE_MAIN = '/';
export const PAGE_DOGGY = '/persik';

export const PANEL_MAIN = 'panel_main';
export const PANEL_DOGGY = 'panel_doggy';

export const VIEW_MAIN = 'view_main';

const routes = {
    [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
    [PAGE_DOGGY]: new Page(PANEL_DOGGY, VIEW_MAIN),
};

const router = new Router(routes);
router.start();
```

### 2. *RouterContext*

App should be wrapped in `<RouterContext.Provider value={router}>`. The most convenient way
to do so inside the *index.js*:

```jsx
// ...

const routes = {
    [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
    [PAGE_DOGGY]: new Page(PANEL_DOGGY, VIEW_MAIN),
};

const router = new Router(routes);
router.start();

ReactDOM.render(
    <RouterContext.Provider value={router}>
        <ConfigProvider isWebView={true}>
            <App/>
        </ConfigProvider>
    </RouterContext.Provider>,
    document.getElementById('root')
);
```

### 3. *useLocation*

Now change component *<App>* so that it uses a router:

```jsx
import { useLocation } from 'router.tsx';

const App = () => {
    const location = useLocation();

    return <View
        id={VIEW_MAIN}
        activePanel={location.getViewActivePanel{VIEW_MAIN}}>
        <Home id={PANEL_MAIN} />
        <Doggy id={PANEL_DOGGY} />
    </View>;
};

export default App;
```

If you don't like using hooks, there is an HOC *withRouter* inside *router.tsx*.

### 4. Use router API to navigate through pages

To go to the page with a Doggy, use a method `router.pushPage(PAGE_DOGGY)`.

*PAGE_DOGGY* is the constant we used in the first step to describe
which *View* and *Panel* we want to show on this page:

```jsx
import { useRouter } from 'router.tsx';

const Home = ({ id }) => {
    const router = useRouter();

    return <Panel id={id}>
        <PanelHeader>Example</PanelHeader>
        <Group title="Navigation Example">
            <Div>
                <Button size="xl" level="2" onClick={() => router.pushPage(PAGE_DOGGY)}>
                    Show me the Doggy, please!
                </Button>
            </Div>
        </Group>
    </Panel>;
};

// ...
```

To go back from the Doggy page, we don't need to specify which page we want to go to.
We just go back using *router.popPage*:

```jsx
// ...

const Doggy = (props) => {
    const router = useRouter();

    return <Panel id={props.id}>
        <PanelHeader
            left={
                <PanelHeaderButton onClick={() => router.popPage()}>
                {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                </PanelHeaderButton>
            }>
            Doggy 
        </PanelHeader>

        // ...

    </Panel>;
};

// ...
```

System «Back» button in Android does the same thing as *router.popPage*.

## 📙 Features

### Page with parameters

If your app has a page with information about the product, user, community or some other entity,
it's often quite handy to open it with some *id*.

Let's say we have a page with a product and we obviously want to know an *id*
to show it's properties.

We can define address for that page in special way:

```javascript
export const PAGE_PRODUCT = '/product/:id([0-9]+)';

const routes = {
    // ...

    [PAGE_PRODUCT]: new Page(PANEL_PRODUCT, VIEW_MAIN),

    // ...
};
```

That definition is very convenient for getting a beautiful links like
«example.com/app12312#product/12»

Handling the redirect to the specific product with given *id* (for example, 1) can be written like that:

```jsx
<Button
    mode="commerce"
    onClick={() => router.pushPage(PAGE_PRODUCT, { id: '1' })}>
    Product #1
</Button>
```

To get and id on a product page, try *useParams* hook or HOC *withParams*:

```jsx
const Product = props => {
    const router = useRouter();
    const { id } = useParams();
    // ...
};
```

### Modals and pop-ups

To close modal windows and pop-ups using system «Back» button, use router's API:

*router.pushModal* / *router.replaceModal* transfers *id* of the modal page to *location.getModalId()*,
which needs to be passed to *activeModal* of the *ModalRoot* component like so:

```jsx
const location = useLocation();
const router = useRouter();

// Modal opening button
<Button
    // ...
    onClick={() => router.pushModal(MODAL_CARD)}
    >
    Open modal card
</Button>

// Pop-up opening button
<Button
    // ...
    onClick={() => router.replacePopup(POPOUT_CONFIRM)}
    >
    Replace pop-up
</Button>

// ...

// Initialize modal
const modal =
    <ModalRoot
        activeModal={location.getModalId()}
        onClose={() => router.popPage()} >

    // ...
    </ModalRoot>;

// Initialize pop-up and call it
const popout = (() => {
    if (location.getPopupId() === POPOUT_CONFIRM) {
        return <Confirm/>;
    }
})();

//
return <Root activeView={location.getViewId()} >
    <View
        // ...

        popout={popout}
        modal={modal}

        // ...
    </View>

    // ...
</Root>
```

*router.pushPopup* / *router.replacePopup* work the same.

### Path changing events

Every time the *pushPage*, *popPage*, *replacePage*, etc. methods are called,
the navigation changing event is generated. There are two ways
to subscribe to them

If we want to receive enter/exit events for a specific page:

```jsx
export const router = new Router(routes);

router.onEnterPage(PAGE_MAIN, () => {
    console.log('Entered the main page');
}); 

router.onLeavePage(PAGE_DOGGY, (nextRoute) => {
    console.log('Leaved a page with a doggy for: ', nextRoute.getPageId());
}); 

router.onEnterPage(PAGE_PRODUCT, (route) => {
    const { id } route.getParams();
    console.log('Entered a product page: ', id);
}); 
```

If we want to receive all the events (pages, pop-ups, modal pages):

```jsx
router.on('update', (nextRoute, oldRoute) => {
    nextRoute.getPageId(); // → /product/:id([0-9]+)
    nextRoute.getParams(); // → { id: "12" }
    nextRoute.getPanelId(); // → panel_product
    nextRoute.getViewId(); // → view_main
    nextRoute.getLocation(); // → /product/12
    nextRoute.isModal(); // → false
    nextRoute.isPopup(); // → false
    nextRoute.hasOverlay(); // → false

    if (oldRoute) {
        console.log(
            `Moved from page ${oldRoute.getLocation()}`,
            ` -> ${nextRoute.getLocation()}`
        );
    } else {
        console.log(
            `Entered the page ${nextRoute.getLocation()}`
        );
    }
});
```

Two objects of type *Route* arrive to the navigation change event.
They describe the new state and the previous state.
Sometimes, the previous state may not be presented, because there was none.

### First page

If your app has multiple entry points, there is a need to declare a first page just to override
the system «Back» button default behaviour. There is a *useFirstPageCheck* hook for that.

```jsx
const Product = props => {
    const router = useRouter();
    const isFirstPage = useFirstPageCheck();

    // ...

    if (isFirstPage) {
        router.replacePage(PAGE_MAIN);
    } else {
        router.popPage();
    }

    // ...
};
```

Alternatively, you can make a similar check using HOC *withRouter*:

```jsx
render() {
    const { location } = this.props;

    location.isFirstPage(); // true or false

    // ...
}
```

### router.tsx can control:

- value of *activeView* in the **Root** component.
- value of *activePanel*, *history* callback for *onSwipeBack* in the **View** component.
- contents of *popout* in the **View** component.
- value of *activeModal*, *onClose* callback in the **ModalRoot** component.
- links like «example.com/app12312#product/15».
- handling of the system «Back» button presses.
- all the transitions between panels, views, modals and pop-ups.

## 🍀 Acknowledgements

Based on: https://github.com/HappySanta/router

## 📝 LICENSE

GNU Lesser General Public License v2.1 only.

