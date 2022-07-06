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
} from 'antd';

import React from 'react';
import { UseQueryResult } from 'react-query';
import { useParams } from 'react-router-dom';
import { antize } from '@/libs/icon';
import { MdOutlineDomain } from 'react-icons/md';
import { Link } from 'react-router-dom';
import type { ColumnsType, TableProps } from 'antd/lib/table';
import { Box, BoxDetail, useBox } from '@/services/arrow-manage/box';
import { format } from 'date-fns';
import { ActiveBox, ReserveBox } from '@/services/arrow-manage/artist';
import { FormOutlined } from '@ant-design/icons';

export type BoxDetailProps = {
  box: BoxDetail;
};

const { Item } = Descriptions;
const { Title } = Typography;
const { useBreakpoint } = Grid;

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



const activeColumns: ColumnsType<ActiveBox> = [
  {
    title: '作家名',
    key: 'artist',
    render: (_, { artist, id }) => (
      <span>{artist?.name}</span>
    ),
    shouldCellUpdate: diffActiveBox('artist'),
  },
  {
    title: '作家記号',
    key: 'artist',
    render: (_, { artist, id }) => (
      <Link to={`/manager/artists/${artist?.id}`}>{artist?.code}</Link>
    ),
    shouldCellUpdate: diffActiveBox('artist'),
  },
  {
    title: '契約開始日',
    key: 'started_on',
    render: (_, { started_on, id }) => (
      <span>{format(new Date(started_on), 'yyyy年MM月dd日')}</span>
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
    shouldCellUpdate: diffActiveBox('money'),
  },
];

const reserveColumns: ColumnsType<ReserveBox> = [
  {
    title: '作家名',
    key: 'artist',
    render: (_, { artist, id }) => (
      <span>{artist?.name}</span>
    ),
    shouldCellUpdate: diffReserveBox('artist'),
  },
  {
    title: '作家記号',
    key: 'artist',
    render: (_, { artist, id }) => (
      <Link to={`/manager/artists/${artist?.id}`}>{artist?.code}</Link>
    ),
    shouldCellUpdate: diffReserveBox('artist'),
  },
  {
    title: '契約開始日',
    key: 'started_on',
    render: (_, { started_on, id }) => (
      <span>{format(new Date(started_on), 'yyyy年MM月dd日')}</span>
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
];

const CompanyDetailPage: React.FC<BoxDetailProps> = ({}) => {
  const { id } = useParams();
  const { data: data } =
    useBox(Number(id)) as UseQueryResult<{box: Box, active_boxes: ActiveBox[], reserve_boxes: ReserveBox[]}>;
  const box = data?.box;
  const active_boxes = data?.active_boxes;
  const reserve_boxes = data?.reserve_boxes;

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

  const ActiveBoxDescriptions = (props: any) => {
    const artist = props.box.artist;
    if (artist) {
      return (
        <MyDescriptions>
          <Item label="作家名">
            <Link to={`/manager/artists/${artist.id}`}>{artist.name}</Link>
          </Item>
          <Item label="作家記号">{artist.code}</Item>
          <Item label="ステータス">{props.box.status}</Item>
        </MyDescriptions>
      )
    } else {
      return (
        <span>なし</span>
      )
    }
  };

  return box ? (
    <>
      <div style={{ paddingLeft: '0.1rem' }}>
        <Title
          level={4}
          style={{ marginBottom: '0' }}
        >{`${box.box_category.code+box.id}`}</Title>
        <div style={{ color: 'GrayText' }}>{box.status}</div>
      </div>
      <Row style={{ marginTop: '15px' }}>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          span={12}
          style={{ paddingRight: '10px' }}
        >
          <Card title={<>{antize(MdOutlineDomain)} 基本情報</>}>
            <MyDescriptions>
              <Item label="箱記号">{box.box_category.code+box.id}</Item>
              <Item label="ステータス">{box.status}</Item>
              <Item label="空く予定">{box.vacanted_on ? format(new Date(box.vacanted_on), 'yyyy年MM月dd日') : ''}</Item>
              <Item label="箱料金">{box.money ? '¥'+box.money.toLocaleString() : ''}</Item>
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
          <Card title={<>{antize(MdOutlineDomain)} 契約・予約中の作家</>}>
            <ActiveBoxDescriptions box={box}></ActiveBoxDescriptions>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col
          xxl={24}
          xl={24}
          lg={24}
          span={24}
          style={{ paddingRight: '10px' }}
        >
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                契約履歴
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={active_boxes}
              columns={activeColumns}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col
          xxl={24}
          xl={24}
          lg={24}
          span={24}
          style={{ paddingRight: '10px' }}
        >
          <Card
            title={
              <>
                <FormOutlined style={{ marginRight: '0.3em' }} />
                予約履歴
              </>
            }
          >
            <Table
              scroll={{ x: true }}
              dataSource={reserve_boxes}
              columns={reserveColumns}
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
