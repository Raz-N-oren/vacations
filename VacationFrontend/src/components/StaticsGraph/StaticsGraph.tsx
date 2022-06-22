import './StaticsGraph.css'; import * as React from 'react';
import {
    ArgumentAxis,
    ValueAxis,
    BarSeries,
    Chart,
} from '@devexpress/dx-react-chart-bootstrap4';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import { ValueScale } from '@devexpress/dx-react-chart';
import { IGraphItem } from '../../models/IGraphItem';
import { AppState } from '../../redux/app-state';
import { useSelector } from 'react-redux';
import { IVacation } from '../../models/IVacation';
import { UserType } from '../../models/UserType';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const StaticsGraph = () => {

    const navigate = useNavigate();
    
    let vacationMap = useSelector((state: AppState) => state.vacationMap);
    const currentUser = useSelector((state: AppState) => state.currentUser);
    
    const isAdmin = currentUser.userType === UserType.Admin;

    useEffect(() => {
        if(!isAdmin){
            alert("Unauthorized entry.");
            navigate("/");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    const chartData: IGraphItem[] = [];
    vacationMap.forEach((vacation: IVacation) => {
        if(vacation.amountOfLikes !== 0){
        chartData.push({ vacationName: vacation.name, amountOfLikes: vacation.amountOfLikes })
        }
    });
    
    return (
        <div className='Statics-Graph-div'>
            <div className='Statics-Graph-title'>Vacation's Followers Statics Graph</div>
            <div className="card">
                <Chart
                    data={chartData}
                >
                    <ValueScale name="amountOfLikes" />

                    <ArgumentAxis />
                    <ValueAxis scaleName="amountOfLikes" showGrid={false} showLine={true} showTicks={true} />
                    <ValueAxis scaleName="total" position="right" showGrid={false} showLine={true} showTicks={true} />

                    <BarSeries
                        name="Units Sold"
                        valueField="amountOfLikes"
                        argumentField="vacationName"
                        scaleName="amountOfLikes"
                    />

                </Chart>
            </div>
        </div>
    );

}

export default StaticsGraph;
