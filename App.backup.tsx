import * as React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Linking, AuthSession, WebBrowser } from 'expo';
import axios from 'axios';
import jwt from 'jwt-decode';
import qs from 'qs';
import client from './src/client';

const test = async () => {
  const c = client({
    baseURL: 'https://api.9spokes.io/dev02',
    tenantId: '00000000-0000-0005-5555-555555555555',
    appKey: 'mobileSmudgeDEV02',
    appSecret: 'zYfCuhQnBz5rvv7nR9s9JZ2AXY49uVVhYYN2BExF',
  });
  try {
    const r = await c.login('nicolas.jiang@9spokes.com', 'Qwer1234');

    // console.log(1, r);
    const r1 = await r.company.list();

    console.log(r1);

    const r2 = await r.company.get(r1[0].companyUuid);

    const rr = await r2.connection.forApp('googleanalytics');
    console.log(rr);
    // console.log('r2', r2);

    // const r3 = await r2.connections();

    // console.log('r3', r3);

    // // const r4 = await r2.connection.get('5bac63adb70b5ea8a3aed237');
    // // console.log('r4', r4);

    const r4 = await r2.workflow.get('googleanalytics');

    console.log('r4', r4);

    // const { workflow } = r4;

    // for (let activity of workflow.activities) {
    //   console.log(activity);
    //   switch (activity.type) {
    //     case 'initiate-connection':
    //     // await r2.connection.create('googleanalytics');
    //   }
    // }
  } catch (err) {
    console.log('err', JSON.stringify(err, null, 2));
    e;
  }
};

const getUser = async (username: string, password: string) => {
  const c = client({
    baseURL: 'https://api.9spokes.io/dev02',
    tenantId: '00000000-0000-0005-5555-555555555555',
    appKey: 'mobileSmudgeDEV02',
    appSecret: 'zYfCuhQnBz5rvv7nR9s9JZ2AXY49uVVhYYN2BExF',
  });

  const r = await c.login(username, password);
  return r;
};
const getCompany = async (user, companyUuid: string) => {
  const r = await user.company.get(companyUuid);
  return r;
};
const callback = (...any: [any]) => {
  console.log('callback<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  console.log(any);
};
const test1 = async (appKey: string) => {
  try {
    const user = await getUser('nicolas.jiang@9spokes.com', 'Qwer1234');

    const companies = await user.company.list();

    console.log(companies);
    const company = await getCompany(user, companies[0].companyUuid);

    const connections = await company.connection.list();

    let connection = connections.find(c => c.appKey === appKey);

    console.log(connection);
    let workflow;
    try {
      workflow = await company.workflow.create(appKey);
    } catch (err) {
      console.log('there exists workflow');
      workflow = await company.workflow.reconnect(appKey);
    }

    let { activities } = workflow;
    let authResult;
    while (activities.length > 0) {
      let act = activities.shift();
      for (let step of act.steps) {
        // console.log('doing', act.type, step);
        if (act.type === 'remove-connection') {
          const arr = step.href.split('/');
          await company.connection.delete(arr[arr.length - 1]);
        } else if (act.type === 'initiate-connection') {
          if (connection) {
            console.log('connection exists');
          } else {
            try {
              connection = await company.connection.create(appKey);
              console.log('connection', connection);
            } catch (err) {
              console.log(err);
            }
          }
        } else if (act.type === 'redirect-user-agent') {
          let redirectUrl = AuthSession.getRedirectUrl();
          // console.log('redirectUrl', redirectUrl);
          authResult = await AuthSession.startAsync({
            authUrl: step.href,
          });
          // console.log(authResult);
        } else if (act.type === 'submit-entity') {
        } else if (act.type === 'get-available-entities') {
          const r = await company.connection.entities(connection.id);
          console.log('entities====', r);
        } else if (act.type === 'submit-authorization') {
          const r = await company.connection.sendAuth(connection.id, {
            ...authResult.params,
            callback: step.id,
            serviceID: appKey,
          });
        }
        const r = await company.workflow.update(workflow.id, act.id, step.id);

        activities = activities.concat(r.activities);
      }
    }
  } catch (err) {
    console.log('ereeer', err, JSON.stringify(err, null, 2));
  }
};
test1('googleanalytics');
// const instance = axios.create({
//   baseURL: 'https://api.9spokes.io/dev02',
//   timeout: 1000,
// });

// const test = async () => {
//   console.log('test');
//   try {
//     console.log('=====================r');
//     const r = await instance.post(
//       '/authentication/tenants/00000000-0000-0005-5555-555555555555/token?grant_type=password',
//       'username=nicolas.jiang@9spokes.com&password=Qwer1234',
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Authorization: 'Basic bW9iaWxlU211ZGdlREVWMDI6ellmQ3VoUW5CejVydnY3blI5czlKWjJBWFk0OXVWVmhZWU4yQkV4Rg==',
//         },
//       }
//     );
//     const { openid, access_token } = r.data;

//     const { sub: userId } = jwt(openid);
//     console.log('userId', userId);
//     console.log('access_token', access_token);

//     const r2 = await instance.get(
//       `/customer/customer/tenants/00000000-0000-0005-5555-555555555555/users/${userId}/companies`,
//       {
//         data: null,
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     const {
//       _embedded: {
//         companies: [{ companyUuid, industryUuid }],
//       },
//     } = r2.data;
//     console.log('r2', r2.data, companyUuid);

//     const r3 = await instance.get(`/customer/customer/tenants/00000000-0000-0005-5555-555555555555/users/${userId}`, {
//       data: null,
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//         'Content-Type': ' application/json',
//       },
//     });
//     const { emailAddress, firstName, lastName, userName } = r3.data;
//     console.log('r3', r3.data, emailAddress, firstName, lastName, userName);

//     const r4 = await instance.post(
//       '/authentication/tenants/00000000-0000-0005-5555-555555555555/token?grant_type=token-exchange',
//       qs.stringify({
//         context: companyUuid,
//         subject_token: openid,
//         subject_token_type: 'openid',
//       }),
//       {
//         headers: {
//           Authorization: 'Basic bW9iaWxlU211ZGdlREVWMDI6ellmQ3VoUW5CejVydnY3blI5czlKWjJBWFk0OXVWVmhZWU4yQkV4Rg==',
//         },
//       }
//     );
//     console.log(r4.data);

//     const { access_token: company_access_token } = r4.data;
//     console.log(company_access_token);

//     const r5 = await instance.get(
//       `connections/connections/tenants/00000000-0000-0005-5555-555555555555/company/${companyUuid}/connections`,
//       {
//         headers: {
//           Authorization: `Bearer ${company_access_token}`,
//         },
//       }
//     );

//     console.log(r5.data);

//     const r6 = await instance.get(
//       `/widget/tenants/00000000-0000-0005-5555-555555555555/users/${userId}/companies/${companyUuid}/widgets`,
//       {
//         headers: {
//           Authorization: `Bearer ${company_access_token}`,
//           'X-API-Version': 3,
//         },
//       }
//     );

//     console.log(r6.data);

//     const r7 = await instance.get('/widget/tenants/00000000-0000-0005-5555-555555555555/widget-configs', {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//         'X-API-Version': 3,
//       },
//     });

//     console.log(r7.data);

//     const r8 = await instance.get(
//       '/widget/tenants/00000000-0000-0005-5555-555555555555/widget-configs/product-gross-profit',
//       {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           'X-API-Version': 3,
//         },
//       }
//     );

//     console.log(r8.data);
//   } catch (err) {
//     console.log('err', JSON.stringify(err, null, 2));
//   }
// };

// test();

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>123 </Text>
      </View>
    );
  }
}

const s = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerStyle: {
          backgroundColor: 'blue',
        },
      },
    },
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'red',
      },
    },
  }
);

export default s;
