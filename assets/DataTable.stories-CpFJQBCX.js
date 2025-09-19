import{j as t}from"./iframe-Bh4nsEqh.js";import{D as Q}from"./DataTable-jb3-XqrE.js";import{B as U}from"./box-CLWAhm56.js";import{c as V,T as g}from"./text-B9-u84IE.js";import{B as X}from"./button-C6_GMqP-.js";import"./index-Cun1SEai.js";import"./flex-BcYWbRrC.js";import"./factory-C2D7TBAW.js";import"./icon-Czktae-r.js";import"./create-slot-recipe-context-DgHzcxly.js";const{withContext:Y}=V({key:"badge"}),Z=Y("span"),a=[{id:1,name:"John Doe",email:"john@example.com",age:28,role:"Developer",status:"active",salary:75e3},{id:2,name:"Jane Smith",email:"jane@example.com",age:32,role:"Designer",status:"active",salary:68e3},{id:3,name:"Tim Lee",email:"bob@example.com",age:45,role:"Manager",status:"inactive",salary:95e3},{id:4,name:"Ada Lovelace",email:"alice@example.com",age:29,role:"Developer",status:"active",salary:72e3},{id:5,name:"Linus Turing",email:"charlie@example.com",age:35,role:"DevOps",status:"active",salary:85e3}],s=[{header:"Name",accessor:"name",sortKey:"name",justifyContent:"flex-start"},{header:"Email",accessor:"email",sortKey:"email",justifyContent:"flex-start"},{header:"Age",accessor:"age",textAlign:"center",sortKey:"age",justifyContent:"center"},{header:"Role",accessor:"role",sortKey:"role",justifyContent:"flex-start",textAlign:"left"}],q=[{header:"Name",accessor:"name",sortKey:"name",width:"200px",justifyContent:"flex-start",render:e=>t.jsxs(U,{className:"test",children:[t.jsx(g,{fontWeight:"bold",children:e.name}),t.jsx(g,{fontSize:"xs",color:"fg.subtle",children:e.email})]})},{header:"Age",accessor:"age",textAlign:"center",sortKey:"age",width:"80px",justifyContent:"center"},{header:"Role",accessor:"role",sortKey:"role",width:"120px",justifyContent:"flex-start"},{header:"Status",sortKey:"status",textAlign:"center",justifyContent:"center",width:"100px",render:e=>t.jsx(Z,{colorPalette:e.status==="active"?"green":"red",variant:"solid",size:"sm",children:e.status})},{header:"Salary",accessor:"salary",textAlign:"right",sortKey:"salary",justifyContent:"flex-end",width:"120px",render:e=>e.salary?`$${e.salary.toLocaleString()}`:"N/A"}],F=a.map(e=>({...e,actions:G=>t.jsx(U,{children:t.jsx(X,{size:"xs",variant:"ghost",onClick:()=>console.log("Edit",G.id),children:"Edit"})})})),me={title:"UI/Data/DataTable",component:Q,parameters:{layout:"padded",docs:{description:{component:"A flexible data table component with sorting, custom rendering, and action support."}}},argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]},pageSize:{control:{type:"number",min:1,max:100}},page:{control:{type:"number",min:1}},hideActions:{control:{type:"boolean"}}}},n={args:{columns:s,data:a}},r={args:{columns:q,data:a},parameters:{docs:{description:{story:"Shows custom cell rendering with badges, formatted text, and complex layouts."}}}},o={args:{columns:s,data:F},parameters:{docs:{description:{story:"Table with action buttons in the last column."}}}},i={args:{columns:s,data:F,hideActions:!0},parameters:{docs:{description:{story:"Table with actions hidden, even when data has actions defined."}}}},c={args:{columns:s,data:a,pageSize:3,page:1},parameters:{docs:{description:{story:"Table with pagination showing 3 items per page."}}}},l={args:{columns:q,data:a,size:"lg"},parameters:{docs:{description:{story:"Table with larger size for better readability."}}}},m={args:{columns:s,data:a,size:"sm"},parameters:{docs:{description:{story:"Compact table with smaller size."}}}},d={args:{columns:s,data:[]},parameters:{docs:{description:{story:"Table with no data to show empty state handling."}}}},p={args:{columns:[{header:"Name",accessor:"name",sortKey:"name"}],data:a},parameters:{docs:{description:{story:"Table with only one column."}}}},u={args:{columns:[{header:"Name",accessor:"name",textAlign:"left",justifyContent:"flex-start"},{header:"Email",accessor:"email",textAlign:"center",justifyContent:"center"},{header:"Role",accessor:"role",textAlign:"right",justifyContent:"flex-end"}],data:a},parameters:{docs:{description:{story:"Table without sorting capabilities (no sortKey defined)."}}}};var h,y,b;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    columns: basicColumns as any,
    // eslint-disable-line
    data: sampleData
  }
}`,...(b=(y=n.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var x,f,C;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    columns: advancedColumns as any,
    // eslint-disable-line
    data: sampleData
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows custom cell rendering with badges, formatted text, and complex layouts.'
      }
    }
  }
}`,...(C=(f=r.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var w,S,A;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    columns: basicColumns as any,
    // eslint-disable-line
    data: dataWithActions
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with action buttons in the last column.'
      }
    }
  }
}`,...(A=(S=o.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};var j,D,T;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    columns: basicColumns as any,
    // eslint-disable-line
    data: dataWithActions,
    hideActions: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with actions hidden, even when data has actions defined.'
      }
    }
  }
}`,...(T=(D=i.parameters)==null?void 0:D.docs)==null?void 0:T.source}}};var z,v,K;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    columns: basicColumns as any,
    // eslint-disable-line
    data: sampleData,
    pageSize: 3,
    page: 1
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with pagination showing 3 items per page.'
      }
    }
  }
}`,...(K=(v=c.parameters)==null?void 0:v.docs)==null?void 0:K.source}}};var N,E,R;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    columns: advancedColumns as any,
    // eslint-disable-line
    data: sampleData,
    size: 'lg'
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with larger size for better readability.'
      }
    }
  }
}`,...(R=(E=l.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};var W,L,B;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    columns: basicColumns as any,
    // eslint-disable-line
    data: sampleData,
    size: 'sm'
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact table with smaller size.'
      }
    }
  }
}`,...(B=(L=m.parameters)==null?void 0:L.docs)==null?void 0:B.source}}};var P,k,H;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    columns: basicColumns as any,
    // eslint-disable-line
    data: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with no data to show empty state handling.'
      }
    }
  }
}`,...(H=(k=d.parameters)==null?void 0:k.docs)==null?void 0:H.source}}};var J,O,_;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    columns: [{
      header: 'Name',
      accessor: 'name',
      sortKey: 'name'
    }] as any,
    // eslint-disable-line
    data: sampleData
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with only one column.'
      }
    }
  }
}`,...(_=(O=p.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var $,I,M;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    columns: [{
      header: 'Name',
      accessor: 'name',
      textAlign: 'left',
      justifyContent: 'flex-start'
    }, {
      header: 'Email',
      accessor: 'email',
      textAlign: 'center',
      justifyContent: 'center'
    }, {
      header: 'Role',
      accessor: 'role',
      textAlign: 'right',
      justifyContent: 'flex-end'
    }] as any,
    // eslint-disable-line
    data: sampleData
  },
  parameters: {
    docs: {
      description: {
        story: 'Table without sorting capabilities (no sortKey defined).'
      }
    }
  }
}`,...(M=(I=u.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};const de=["Default","WithCustomRendering","WithActions","HiddenActions","Pagination","LargeSize","SmallSize","EmptyData","SingleColumn","NoSorting"];export{n as Default,d as EmptyData,i as HiddenActions,l as LargeSize,u as NoSorting,c as Pagination,p as SingleColumn,m as SmallSize,o as WithActions,r as WithCustomRendering,de as __namedExportsOrder,me as default};
