import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import router from 'umi/router';

import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

export interface StateType {
  success?: boolean | null | undefined;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    success: null,
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(fakeAccountLogin, payload);

        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });

        // Login successfully
        if (response.success) {
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params as { redirect: string };
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = '/';
              return;
            }
          }

          localStorage.setItem('token', response.data.token);

          router.replace(redirect || '/');
        }
      } catch (e) {
        message.error(e.data.message);

        yield put({
          type: 'changeLoginStatus',
          payload: e.data,
        });
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        success: payload.success,
      };
    },
  },
};

export default Model;
