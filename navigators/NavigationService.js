import { NavigationActions } from 'react-navigation';

let _navigator;

function setRootNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}
function replace(routeName, params) {
  _navigator.dispatch(
    NavigationActions.replace({
      routeName,
      params,
    })
  );
}

function goBack() {
  _navigator.dispatch(
    NavigationActions.back()
  );
}

export default {
  navigate,
  replace,
  goBack,
  setRootNavigator,
};
