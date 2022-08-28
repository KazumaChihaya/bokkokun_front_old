import {
  Col,
  Descriptions,
  Row,
  Typography,
  Grid,
  DescriptionsProps,
  Card,
  Table,
} from 'antd';

import React from 'react';
import { UseQueryResult } from 'react-query';
import { ArtistDetail, BoxInvoice, EarnInvoice, Artist, ActiveBox, ReserveBox, useArtist, Offset } from '@/services/artist/home';
import { antize } from '@/libs/icon';
import { MdOutlineDomain } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FormOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import { Box } from '@/services/manager/box';
import { format } from 'date-fns';
import ActiveBoxAdd from './components/ActiveBoxAdd';
import { status_opt } from '@/pages/Manager/BoxInvoices/components/util';
import { Earn } from '@/services/manager/earn';
import OffsetCalc from './components/OffsetCalc';

export type ArtistDetailProps = {
  artist: ArtistDetail;
};

const { Item } = Descriptions;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const diffBox = (...props: (keyof Box)[]) => {
  return (box: Box, prev: Box) => {
    for (const prop of props) {
      if (box[prop] !== prev[prop]) return true;
    }
    return false;
  };
};
const diffEarnInvoice = (...props: (keyof EarnInvoice)[]) => {
  return (earn_invoice: EarnInvoice, prev: EarnInvoice) => {
    for (const prop of props) {
      if (earn_invoice[prop] !== prev[prop]) return true;
    }
    return false;
  };
};
const diffBoxInvoice = (...props: (keyof BoxInvoice)[]) => {
  return (box_invoice: BoxInvoice, prev: BoxInvoice) => {
    for (const prop of props) {
      if (box_invoice[prop] !== prev[prop]) return true;
    }
    return false;
  };
};
const diffEarn = (...props: (keyof Earn)[]) => {
  return (earn: Earn, prev: Earn) => {
    for (const prop of props) {
      if (earn[prop] !== prev[prop]) return true;
    }
    return false;
  };
};
const diffOffset = (...props: (keyof Offset)[]) => {
  return (offset: Offset, prev: Offset) => {
    for (const prop of props) {
      if (offset[prop] !== prev[prop]) return true;
    }
    return false;
  };
};


const boxColumns: ColumnsType<Box> = [
  {
    title: '箱記号',
    key: 'boxcode',
    render: (_, { box_category, id }) => (
      <div style={{ minWidth: '8em' }}>
        <Link to={`/manager/boxes/${id}`}>{box_category.code+id}</Link>
      </div>
    ),
    shouldCellUpdate: diffBox('box_category'),
  },
  {
    title: 'ステータス',
    dataIndex: 'status',
    width: '12em',
    shouldCellUpdate: diffBox('status'),
  },
  {
    title: '箱料金',
    key: 'money',
    width: '12em',
    render: (_, { status, money, special_money }) => (
      <span>{status === '予約中' ? '' : (special_money ? '¥'+special_money.toLocaleString() : money.toLocaleString())}</span>
    ),
    shouldCellUpdate: diffBox('money') || diffBox('special_money'),
  },
];

const boxInvoiceColumns: ColumnsType<BoxInvoice> = [
  {
    title: '年月',
    key: 'yermonth',
    render: (_, { yearmonth, id }) => (
      <span>{format(new Date(yearmonth+'-01'), 'yyyy年MM月')}</span>
    ),
    shouldCellUpdate: diffBoxInvoice('yearmonth'),
  },
  {
    title: '金額',
    key: 'money',
    render: (_, { each_box_invoice, id }) => (
      <span>{each_box_invoice ? '¥'+each_box_invoice?.money.toLocaleString() : 'データなし'}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffBoxInvoice('each_box_invoice'),
  },
  {
    title: '支払',
    key: 'ended_on',
    render: (_, { each_box_invoice, id }) => (
      <>
        <span style={{marginRight: '5px'}}>{id === 0 ? '前払' : (status_opt[each_box_invoice?.status ? 1 : 0])}</span>
      </>
    ),
    width: '10em',
    shouldCellUpdate: diffBoxInvoice('each_box_invoice'),
  },
];

const earnInvoiceColumns: ColumnsType<EarnInvoice> = [
  {
    title: '年月',
    key: 'yermonth',
    render: (_, { yearmonth, id }) => (
      <span>{format(new Date(yearmonth+'-01'), 'yyyy年MM月')}</span>
    ),
    shouldCellUpdate: diffEarnInvoice('yearmonth'),
  },
  {
    title: '売上',
    key: 'money',
    render: (_, { each_earn_invoice, id }) => (
      <span>{each_earn_invoice ? '¥'+each_earn_invoice?.money.toLocaleString() : 'データなし'}</span>
    ),
    width: '100px',
    shouldCellUpdate: diffEarnInvoice('each_earn_invoice'),
  },
  {
    title: '箱代相殺',
    key: 'offset_money',
    render: (_, { each_earn_invoice, id }) => (
      <span>{each_earn_invoice ? '¥'+each_earn_invoice?.offset_money.toLocaleString() : 'データなし'}</span>
    ),
    width: '100px',
    shouldCellUpdate: diffEarnInvoice('each_earn_invoice'),
  },
  {
    title: '支払金額',
    key: 'result_money',
    render: (_, { each_earn_invoice, id }) => (
      <span>{each_earn_invoice ? '¥'+(each_earn_invoice?.money - each_earn_invoice?.offset_money).toLocaleString() : 'データなし'}</span>
    ),
    width: '100px',
    shouldCellUpdate: diffEarnInvoice('each_earn_invoice'),
  },
  {
    title: '支払',
    key: 'ended_on',
    render: (_, { each_earn_invoice, id }) => (
      <span>{each_earn_invoice ? (each_earn_invoice?.status ? '済' : '未') : ''}</span>
    ),
    width: '50px',
    shouldCellUpdate: diffEarnInvoice('each_earn_invoice'),
  },
];

const offsetColumns: ColumnsType<Offset> = [
  {
    title: '精算',
    key: 'yearmonth',
    render: (_, { earn_invoice_yearmonth, id }) => (
      <span>{format(new Date(earn_invoice_yearmonth+'-01'), 'yyyy年MM月分から')}</span>
    ),
    width: '150px',
    shouldCellUpdate: diffOffset('earn_invoice_yearmonth'),
  },
  {
    title: '箱代',
    key: 'yearmonth',
    render: (_, { yearmonth, id }) => (
      <span>{format(new Date(yearmonth+'-01'), 'yyyy年MM月分を引く')}</span>
    ),
    width: '160px',
    shouldCellUpdate: diffOffset('yearmonth'),
  },
  {
    title: '金額',
    key: 'money',
    render: (_, { money, id }) => (
      <span>{'¥'+money.toLocaleString()}</span>
    ),
    width: '80px',
    shouldCellUpdate: diffOffset('money'),
  },
  {
    title: '相殺日',
    key: 'date',
    render: (_, { date, id }) => (
      <span>{format(new Date(date), 'yyyy年MM月dd日')}</span>
    ),
    shouldCellUpdate: diffOffset('date'),
  },
];

const earnColumns: ColumnsType<Earn> = [
  {
    title: '作品記号',
    key: 'art_code',
    render: (_, { code, id }) => (
      <div style={{ minWidth: '8em' }}>{code}</div>
    ),
    shouldCellUpdate: diffEarn('code'),
  },
  {
    title: '価格',
    key: 'money',
    render: (_, { money, id }) => (
      <div style={{ width: '6em' }}>
        ¥{money.toLocaleString()}
      </div>
    ),
    shouldCellUpdate: diffEarn('money'),
  },
  {
    title: '売上日',
    key: 'date',
    render: (_, { date, id }) => (
      <div style={{ width: '8em' }}>
        {format(new Date(date), 'yyyy年MM月dd日')}
      </div>
    ),
    shouldCellUpdate: diffEarn('date'),
  },
];

const ArtistHomePage: React.FC = () => {
  const { data: data } =
    useArtist() as UseQueryResult<{artist: Artist, boxes: Box[], active_boxes: ActiveBox[], reserve_boxes: ReserveBox[], box_invoices: BoxInvoice[], earn_invoices: EarnInvoice[], earns: Earn[], deposit: number, offsets: Offset[], latest_yet_box_invoice_yearmonth?: string, latest_yet_box_invoice_money?: number}>;
  const artist = data?.artist;
  const boxes = data?.boxes;
  const box_invoices = data?.box_invoices;
  const earn_invoices = data?.earn_invoices;
  const earns = data?.earns;
  const deposit = data?.deposit ?? 0;
  const offsets = data?.offsets;
  const latest_yet_box_invoice_yearmonth = data?.latest_yet_box_invoice_yearmonth;
  const latest_yet_box_invoice_money = data?.latest_yet_box_invoice_money;

  const bp = useBreakpoint();

  const MyDescriptions: React.FC<DescriptionsProps> = (props) => (
    <Descriptions
      size="small"
      labelStyle={{ width: '13em' }}
      bordered
      column={{ sm: 1, xs: 1, md: 1 }}
      layout={!bp.md ? 'vertical' : 'horizontal'}
      {...props}
    />
  );

  return artist ? (
    <>
      <div style={{ paddingLeft: '0.1rem' }}>
        <Title
          level={4}
          style={{ marginBottom: '0' }}
        >{`${artist.name}`}</Title>
        <div style={{ color: 'GrayText' }}>{artist.code}</div>
      </div>
      <Row style={{ marginTop: '15px' }} gutter={[8, 16]}>
        <Col
          lg={12}
          md={24}
          sm={24}
          xs={24}
          span={12}
        >
          <Card title={<>{antize(MdOutlineDomain)} 現在の残高</>}>
            <MyDescriptions>
              <Item label="現在の残高">¥{deposit?.toLocaleString()}</Item>
            </MyDescriptions>
            <br></br>
            <OffsetCalc yearmonth={latest_yet_box_invoice_yearmonth} box_money={latest_yet_box_invoice_money} deposit={deposit}/>　
          </Card>
          <br></br>
          <Card title={<><FormOutlined style={{ marginRight: '0.3em' }} />契約・予約中の箱</>}>
            <Table
              scroll={{ x: true }}
              dataSource={boxes}
              columns={boxColumns}
              size="small"
              pagination={false}
              rowKey="id"
            />
          </Card>
          <br></br>
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                箱代清算
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={box_invoices}
              columns={boxInvoiceColumns}
              size="small"
              pagination={false}
              rowKey="id"
            />
          </Card>
          <br></br>
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                売上清算
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={earn_invoices}
              columns={earnInvoiceColumns}
              size="small"
              pagination={false}
              rowKey="id"
            />
          </Card>
          <br></br>
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                箱代相殺履歴
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={offsets}
              columns={offsetColumns}
              size="small"
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
        <Col
          lg={12}
          md={24}
          sm={24}
          xs={24}
          span={12}
        >
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                売上一覧
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={earns}
              columns={earnColumns}
              size="small"
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <></>
  );
};

export default ArtistHomePage;
