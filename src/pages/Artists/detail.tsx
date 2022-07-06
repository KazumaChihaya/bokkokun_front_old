import {
  Col,
  Descriptions,
  Row,
  Typography,
  Grid,
  DescriptionsProps,
  Card,
  Button,
  Table,
  Input,
} from 'antd';

import React, { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useParams } from 'react-router-dom';
import { ArtistDetail, BoxInvoice, EarnInvoice } from '@/services/arrow-manage/artist';
import { antize } from '../../libs/icon';
import { MdOutlineDomain } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FormOutlined, TagsOutlined } from '@ant-design/icons';
import { Artist, ActiveBox, ReserveBox, useArtist } from '@/services/arrow-manage/artist';
import { contact } from './util';
import type { ColumnsType, TableProps } from 'antd/lib/table';
import { Box } from '@/services/arrow-manage/box';
import { format } from 'date-fns';
import ArtistEdit from './components/ArtistEdit';
import ActiveBoxAdd from './components/ActiveBoxAdd';
import ActiveBoxDelete from './components/ActiveBoxDelete';
import ReserveBoxAdd from './components/ReserveBoxAdd';
import ActiveBoxResign from './components/ActiveBoxResign';
import ReserveBoxResign from './components/ReserveBoxResign';
import ActiveBoxEdit from './components/ActiveBoxEdit';
import ReserveBoxEdit from './components/ReserveBoxEdit';
import ReserveBoxDelete from './components/ReserveBoxDelete';
import ReserveBoxReserveToActive from './components/ReserveBoxReserveToActive';
import { Pool, usePool, usePoolCalc } from '@/services/arrow-manage/pool';
import PoolAdd from './components/PoolAdd';
import PoolEdit from './components/PoolEdit';
import PoolDelete from './components/PoolDelete';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { status_opt } from '../BoxInvoices/components/util';
import ChangeStatus from '../BoxInvoices/components/ChangeStatus';

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
const diffActiveBox = (...props: (keyof ActiveBox)[]) => {
  return (active_box: ActiveBox, prev: ActiveBox) => {
    for (const prop of props) {
      if (active_box[prop] !== prev[prop]) return true;
    }
    return false;
  };
};
const diffReserveBox = (...props: (keyof ReserveBox)[]) => {
  return (reserve_box: ReserveBox, prev: ReserveBox) => {
    for (const prop of props) {
      if (reserve_box[prop] !== prev[prop]) return true;
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
const diffPool = (...props: (keyof Pool)[]) => {
  return (pool: Pool, prev: Pool) => {
    for (const prop of props) {
      if (pool[prop] !== prev[prop]) return true;
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
        <Link to={`/boxes/${id}`}>{box_category.code+id}</Link>
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
  {
    title: '解約予定日',
    key: 'button',
    width: '12em',
    render: (_, box) => (
      box.status == '予約中' ?
      (
        box.reserve_box?.ended_on === null ?
        <>
          <ReserveBoxResign box={box}/>
          <ReserveBoxReserveToActive box={box}/>
        </> :
        <span>{format(new Date(box.reserve_box?.ended_on ?? '0000-00-00'), 'yyyy年MM月dd日')}</span>
      ) :
      (
        box.status == 'アクティブ' ?
        (
          box.active_box?.ended_on === null ?
          <ActiveBoxResign box={box}/> :
          <span>{format(new Date(box.active_box?.ended_on ?? '0000-00-00'), 'yyyy年MM月dd日')}</span>
        ) :
        <span></span>
      )
    ),
  },
];


const poolColumns: ProColumns<Pool> = [
  {
    title: '日付',
    key: 'date',
    render: (_, { date, id }) => (
      <div style={{ minWidth: '8em' }}>
        {format(new Date(date), 'yyyy年MM月dd日')}
      </div>
    ),
    shouldCellUpdate: diffPool('date'),
  },
  {
    title: '金額',
    key: 'money',
    render: (_, { money, id }) => (
      <div style={{ minWidth: '8em' }}>
        ¥{money.toLocaleString()}
      </div>
    ),
    shouldCellUpdate: diffPool('money'),
  },
  {
    title: '変更',
    key: 'button',
    width: '12em',
    render: (_, pool) => (
      <>
        <PoolEdit key={"edit_pool_"+pool.id} pool={pool}/> 
        <PoolDelete key={"delete_pool_"+pool.id} pool={pool}/> 
      </>
    ),
  },
];

const activeBoxColumns: ColumnsType<ActiveBox> = [
  {
    title: '箱記号',
    key: 'boxcode',
    render: (_, { box, id }) => (
      <div style={{ minWidth: '8em' }}>
        <Link to={`/boxes/${box?.id}`}>{(box ? box?.box_category?.code : '')+box?.id}</Link>
      </div>
    ),
    shouldCellUpdate: diffActiveBox('id'),
  },
  {
    title: '契約開始日',
    key: 'started_on',
    render: (_, { started_on, id }) => (
      <span>{started_on ? format(new Date(started_on), 'yyyy年MM月dd日') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffActiveBox('started_on'),
  },
  {
    title: '契約終了日',
    key: 'ended_on',
    render: (_, { ended_on, id }) => (
      <span>{ended_on ? format(new Date(ended_on), 'yyyy年MM月dd日') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffActiveBox('ended_on'),
  },
  {
    title: '箱料金',
    key: 'money',
    render: (_, { money, id }) => (
      <span>{money ? '¥'+money.toLocaleString() : ''}</span>
    ),
    width: '10em',
  },
  {
    title: '変更',
    key: 'button',
    width: '12em',
    render: (_, active_box) => (
      <>
        <ActiveBoxEdit key={"edit_active_box_"+active_box.id} active_box={active_box}/>
        <ActiveBoxDelete key={"delete_active_box_"+active_box.id}  active_box={active_box}/>
      </>
    ),
  },
];

const reserveBoxColumns: ColumnsType<ReserveBox> = [
  {
    title: '箱記号',
    key: 'boxcode',
    render: (_, { box, id }) => (
      <div style={{ minWidth: '8em' }}>
        <Link to={`/boxes/${box?.id}`}>{(box ? box?.box_category?.code : '')+box?.id}</Link>
      </div>
    ),
    shouldCellUpdate: diffReserveBox('id'),
  },
  {
    title: '契約開始日',
    key: 'started_on',
    render: (_, { started_on, id }) => (
      <span>{started_on ? format(new Date(started_on), 'yyyy年MM月dd日') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffReserveBox('started_on'),
  },
  {
    title: '契約終了日',
    key: 'ended_on',
    render: (_, { ended_on, id }) => (
      <span>{ended_on ? format(new Date(ended_on), 'yyyy年MM月dd日') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffReserveBox('ended_on'),
  },
  {
    title: '変更',
    key: 'button',
    width: '12em',
    render: (_, reserve_box) => (
      <>
        <ReserveBoxEdit key={"edit_reserve_box_"+reserve_box.id} reserve_box={reserve_box}/>
        <ReserveBoxDelete key={"delete_reserve_box_"+reserve_box.id}  reserve_box={reserve_box}/>
      </>
    ),
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
        <span style={{marginRight: '5px'}}>{status_opt[each_box_invoice?.status ? 1 : 0]}</span>
        <ChangeStatus key={"change_finish_"+each_box_invoice?.id} status={each_box_invoice?.status ?? false} each_box_invoice_id={each_box_invoice?.id ?? 0} box_invoice_id={each_box_invoice?.box_invoice_id ?? 0} artist_id={each_box_invoice?.artist_id ?? 0}/> 
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
    title: '金額',
    key: 'money',
    render: (_, { each_earn_invoice, id }) => (
      <span>{each_earn_invoice ? '¥'+each_earn_invoice?.money.toLocaleString() : 'データなし'}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffEarnInvoice('each_earn_invoice'),
  },
  {
    title: '支払',
    key: 'ended_on',
    render: (_, { each_earn_invoice, id }) => (
      <span>{each_earn_invoice ? (each_earn_invoice?.status ? '済' : '未') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diffEarnInvoice('each_earn_invoice'),
  },
];

const CompanyDetailPage: React.FC<ArtistDetailProps> = ({}) => {
  const { id } = useParams();
  const { data: data } =
    useArtist(Number(id)) as UseQueryResult<{artist: Artist, boxes: Box[], active_boxes: ActiveBox[], reserve_boxes: ReserveBox[], box_invoices: BoxInvoice[], earn_invoices: EarnInvoice[]}>;
  const { data: pools, isLoading } =
    usePool(Number(id)) as UseQueryResult<Pool[]>;
  const { data: pool_calc } =
    usePoolCalc(Number(id)) as UseQueryResult<{sum: number, yearmonth: string | null, mod: number | null, }>;
  const artist = data?.artist;
  const boxes = data?.boxes;
  const active_boxes = data?.active_boxes;
  const reserve_boxes = data?.reserve_boxes;
  const box_invoices = data?.box_invoices;
  const earn_invoices = data?.earn_invoices;

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
      <Row style={{ marginTop: '15px' }}>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          span={12}
          style={{ paddingRight: '10px' }}
        >
          <Card title={<>{antize(MdOutlineDomain)} 基本情報　　　 <ArtistEdit artist={artist}/></>}>
            <MyDescriptions>
              <Item label="作家名">{artist.name}</Item>
              <Item label="作家記号">{artist.code}</Item>
              <Item label="メールアドレス">{artist.mail}</Item>
              <Item label="twitter">@{artist.twitter}</Item>
              <Item label="instagram">{artist.instagram}</Item>
              <Item label="連絡方法">{contact[artist.contact]}</Item>
              <Item label="手数料%">{artist.rate}%</Item>
            </MyDescriptions>
          </Card>
        </Col>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          span={12}
          style={{ paddingLeft: '10px' }}
        >
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                契約・予約中の箱　　　
                <ActiveBoxAdd artist={artist}/> 
                <ReserveBoxAdd artist={artist}/>
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={boxes}
              columns={boxColumns}
              size="small"
              pagination={false}
            />
          </Card>

          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                箱の契約履歴
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={active_boxes}
              columns={activeBoxColumns}
              size="small"
              pagination={false}
            />
          </Card>

          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                箱の予約履歴
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={reserve_boxes}
              columns={reserveBoxColumns}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          span={12}
          style={{ paddingRight: '10px' }}
        >
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                前払いプール
                <PoolAdd artist={artist}/>
              </>
            }
          >
            <ProTable
              scroll={{ x: true }}
              dataSource={pools}
              loading={isLoading}
              columns={poolColumns}
              pagination={false}
              search={false}
              size="small"
              tableExtraRender={(_, data) => (
                <Card>
                  <Descriptions size="small" layout="vertical" column={2} bordered>
                    <Descriptions.Item label="プール合計金額">
                      ¥{pool_calc?.sum.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="概算支払済月">
                      {(pool_calc?.yearmonth ? 
                        format(new Date(pool_calc.yearmonth+'-01'), 'yyyy年MM月')+'まで'
                        : '計算不可'
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="余り">
                      {(pool_calc?.mod ? 
                        '¥'+pool_calc?.mod.toLocaleString()
                        : '計算不可'
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              )}
            />
          </Card>
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
            />
          </Card>
        </Col>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          span={12}
          style={{ paddingLeft: '10px' }}
        >
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
            />
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <></>
  );
};

export default CompanyDetailPage;
