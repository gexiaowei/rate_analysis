/**
 * jquery.jhss.chart
 * @author Vivian
 * @version 1.0.0
 * copyright 2014-2015, gandxiaowei@gmail.com. all rights reserved.
 */
(function ($, d3) {
    'use strict';

    var JHSSChart = {
        version: '1.0.0',
        duration: 1000
    };

    /**
     * 基础图表
     * @param containerNode 父容器节点
     * @constructor
     */
    function BaseChart(containerNode) {
        var svg = d3.select(containerNode).append('svg').attr("width", '100%').attr("height", '100%');
        this.svg = svg;
        this.size = {
            width: svg[0][0].offsetWidth,
            height: svg[0][0].offsetHeight
        };
        this.edge = d3.min([this.size.width, this.size.height]);
    }

    /**
     * 饼图
     * @param containerNode
     * @param option
     * @constructor
     * @extends {BaseChart}
     */
    function PieChart(containerNode, option) {
        BaseChart.call(this, containerNode);
        var svg = this.svg;
        var pie = d3.layout.pie().sort(null);
        var edge = this.edge;

        if (!option) {
            option = {
                outer: 0.3,
                inner: 0.2
            };
        }
        var color = option.color || ['#FFC06B', '#6CE6B2', '#FF6C65'];

        var outerRadius = edge * option.outer;
        var innerRadius = edge * option.inner;
        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var initData = [];
        for (var i = 0; i < color.length; i++) {
            initData.push(0);
        }
        initData.push(1);

        initData = pie(initData).slice(0, color.length);

        var path = svg.selectAll('g')
            .data(initData)
            .enter()
            .append('g')
            .attr("transform", "translate(" + this.size.width / 2 + "," + this.size.height / 2 + ")")
            .append("path")
            .attr('fill', function (d, i) {
                return color[i];
            })
            .attr('d', function (d) {
                return arc((d));
            })
            .each(function (d) {
                this._current = d;
            });

        this.animate = function (dataset) {
            path.data(pie(dataset))
                .transition()
                .duration(JHSSChart.duration)
                .ease('bounce')
                .attrTween('d', function (d) {
                    var i = d3.interpolate(this._current, d);
                    return function (t) {
                        return arc(i(t));
                    };
                });
        };
    }

    /**
     * 重新设计数据
     * @param dataset 数据集合
     */
    PieChart.prototype.setData = function (dataset) {
        this.animate(dataset);
    };

    JHSSChart.PieChart = PieChart;

    /**
     * 饼图（百分比）
     * @param containerNode
     * @param option
     * @constructor
     * @extends {PieChart}
     */
    function PiePercentChart(containerNode, option) {
        if (!option) {
            option = {};
        }
        option.outer = option.outer || 0.5;
        option.inner = option.inner || 0.4;
        PieChart.call(this, containerNode, option);

        var svg = this.svg;

        var mark = svg.selectAll('g')
            .append('g');
        mark.append('circle')
            .attr({
                x: this.size.width / 2,
                y: this.size.height / 2,
                r: this.edge * 0.3,
                fill: option.color[0]
            });
        var percent = mark.selectAll('text')
            .data([0])
            .enter()
            .append('text')
            .attr({
                'text-anchor': 'middle',
                'dominant-baseline': 'central',
                'font-size': this.edge * 0.2,
                'fill': '#FFFFFF'
            })
            .text(function (d) {
                return d;
            })
            .each(function (d) {
                this._current = d;
            });

        this.extendAnimate = function (dataset) {
            var tempData = [dataset, 100 - dataset];
            this.animate(tempData);
            percent.data([dataset])
                .transition()
                .duration(JHSSChart.duration)
                .ease('bounce')
                .tween('text', function (d) {
                    var i = d3.interpolateNumber(this._current, d);
                    return function (t) {
                        var c = i(t);
                        if (option.format) {
                            c = option.format(c);
                        }
                        this.textContent = c;
                    };
                });
        };
    }

    /**
     * 设置数据
     * @param dataset
     */
    PiePercentChart.prototype.setData = function (dataset) {
        this.extendAnimate(dataset);
    };

    JHSSChart.PiePercentChart = PiePercentChart;

    /**
     * 饼图(打败百分比)
     * @param containerNode
     * @param option
     * @constructor
     * @extends {PieChart}
     */
    function BeatChart(containerNode, option) {
        if (!option) {
            option = {};
        }
        option.outer = option.outer || 0.5;
        option.inner = option.inner || 0.4;
        PieChart.call(this, containerNode, option);
        var svg = this.svg;
        var mark = svg.selectAll('g')
            .append('g');
        var percent = mark.selectAll('text')
            .data([0])
            .enter()
            .append('text')
            .attr('fill', option.color[0])
            .attr('text-anchor', 'middle')
            .attr('font-size', this.edge * 0.2)
            .attr("transform", "translate(" + 0 + "," + this.edge * 0.1 + ")")
            .text(function (d) {
                return d + '%';
            })
            .each(function (d) {
                this._current = d;
            });
        mark.append('text')
            .attr('fill', '#FF7576')
            .attr('text-anchor', 'end')
            .attr("transform", "translate(" + 0 + "," + (-this.edge * 0.1) + ")")
            .text('打败');
        mark.append('text')
            .attr('fill', '#FF7576')
            .attr('text-anchor', 'start')
            .attr("transform", "translate(" + 0 + "," + this.edge * 0.18 + ")")
            .text('用户');
        this.extendAnimate = function (dataset) {
            var tempData = [dataset, 100 - dataset];
            this.animate(tempData);
            percent.data([dataset])
                .transition()
                .duration(JHSSChart.duration)
                .ease('bounce')
                .tween('text', function (d) {
                    var i = d3.interpolateNumber(this._current, d);
                    return function (t) {
                        this.textContent = ((i(t)).toFixed(0) + '%');
                    };
                });
        };
    }

    /**
     * 重新设计数据
     * @param dataset 数据集合
     */
    BeatChart.prototype.setData = function (dataset) {
        this.extendAnimate(dataset);
    };

    JHSSChart.BeatChart = BeatChart;

    /**
     * 分布图
     * @param containerNode 父节点
     * @param option 分布图属性
     * @constructor
     * @extends {BaseChart}
     */
    function DistributionChart(containerNode, option) {
        BaseChart.call(this, containerNode);
        var svg = this.svg;
        var size = this.size;

        if (!option) {
            option = {};
        }

        var distribution = option.distribution || ['0%-15%', '15%-30%', '30%-50%', '50%-75%', '75%-90%', '90%-100%'];
        var color = option.color || ['#D6ADEE', '#4EC3F9', '#73E7DD', '#A0E179', '#FFC471', '#FF9A9C'];
        var dataset = [];
        for (var i = 0; i < distribution.length; i++) {
            dataset.push(0);
        }


        var perHeight = size.height / (distribution.length * 1.5);
        var minWidth = 110;

        var yAxisScale = d3.scale.linear()
            .domain([0, distribution.length - 1])
            .range([size.height - perHeight / 2, perHeight / 2]);

        var yAxis = d3.svg.axis()
            .orient('left')
            .scale(yAxisScale)
            .outerTickSize(minWidth)
            .ticks(distribution.length)
            .tickFormat(function (d) {
                return distribution[d % distribution.length];
            });

        var xScale = d3.scale.linear()
            .domain([0, d3.max(dataset) || 1])
            .range([minWidth + 40, size.width - perHeight / 2]);

        this.xScale = xScale;

        this.roundLines = svg.selectAll('line')
            .data(dataset)
            .enter()
            .append('line')
            .attr('stroke-linecap', 'round')
            .attr('x1', 0)
            .attr('y1', function (d, i) {
                return yAxisScale(i);
            })
            .attr('x2', xScale)
            .attr('y2', function (d, i) {
                return yAxisScale(i);
            })
            .attr("stroke-width", perHeight)
            .attr('stroke', function (d, i) {
                return color[i];
            });

        this.numMark = svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .attr('dy', '0.32em')
            .attr("text-anchor", "end")
            .attr('fill', '#FFFFFF')
            .attr('x', function (d) {
                return xScale(d) - 5;
            })
            .attr('y', function (d, i) {
                return yAxisScale(i);
            }).text(function (d) {
                return d + '天';
            });

        svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', minWidth)
            .attr('height', size.height)
            .attr('fill', 'rgba(255,255,255,0.7)');

        svg.append('g')
            .call(yAxis)
            .attr({
                "transform": "translate(100,0)"
            })
            .attr('fill', 'transparent')
            .selectAll('text')
            .attr('fill', function (d) {
                return color[d];
            });

        this.animate = function (dataset) {
            var self = this;
            var duration = JHSSChart.duration;
            var ease = 'linear';

            this.xScale.domain([0, d3.max(dataset) || 1]);

            this.roundLines
                .data(dataset)
                .transition()
                .duration(duration)
                .ease(ease)
                .attr('x2', function (d) {
                    return self.xScale(d);
                });

            this.numMark
                .data(dataset)
                .transition()
                .duration(duration)
                .ease(ease)
                .attr('x', function (d) {
                    return self.xScale(d) - 5;
                })
                .tween('text', function (d) {
                    var startNum = parseInt(this.textContent, 10);
                    return function (t) {
                        this.textContent = (startNum + (d - startNum) * t).toFixed(0) + '天';
                    };
                });
        };

        if (option.dataset) {
            this.setData(dataset);
        }
    }

    /**
     * 重新设计数据
     * @param dataset 数据集合
     */
    DistributionChart.prototype.setData = function (dataset) {
        this.animate(dataset);
    };

    JHSSChart.DistributionChart = DistributionChart;

    /**
     * 柱状图(收益图)
     * @param containerNode 父节点
     * @param option 分布图属性
     * @constructor
     * @extends {BaseChart}
     */
    function ProfitChart(containerNode, option) {
        BaseChart.call(this, containerNode);
        if (!option) {
            option = {};
        }
        var svg = this.svg;
        var color = option.color || ['#FF9A9C', '#FFCD87', '#FFAD7F', '#A0E179', '#73E7DD', '#92D8F9', '#D6ADEE'];
        var label = option.label || ['我的年化收益', '1年定存', '5年定存', '5年国债', '宝类', '银行理财', 'CPI'];

        this.bindData = function (data) {
            var dataObjs = [];
            for (var i = 0; i < label.length; i++) {
                dataObjs.push({label: label[i], data: data[i]});
            }
            return dataObjs;
        };

        var dataset = option.dataset;
        if (!dataset) {
            dataset = [];
            for (var i = 0; i < color.length; i++) {
                dataset.push(0);
            }
        }

        var data = this.bindData(dataset);
        var max = d3.max(dataset) || 1;

        var xAxisScale = d3.scale.ordinal()
            .domain(label)
            .rangeRoundBands([0, this.size.width], 0.2);

        var yScale = d3.scale.linear()
            .domain([0, max])
            .range([this.size.height, 0]);

        var profitContainers = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', function (d) {
                return 'translate(' + (xAxisScale(d.label)) + ', 0)';
            });

        //背景色
        profitContainers.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', xAxisScale.rangeBand())
            .attr('height', function () {
                return yScale(0);
            })
            .attr('fill', '#E9E9E9');

        profitContainers.append('rect')
            .attr('class', 'value')
            .attr('x', 0)
            .attr('y', function (d) {
                return yScale(d.data);
            })
            .attr('width', xAxisScale.rangeBand())
            .attr('height', function (d) {
                return yScale(0) - yScale(d.data);
            })
            .attr('fill', function (d, i) {
                return color[i];
            });

        this.animate = function (dataset) {
            yScale.domain([0, d3.max(dataset) * 1.1]);
            profitContainers
                .data(this.bindData(dataset))
                .select('.value')
                .transition()
                .duration(JHSSChart.duration)
                .ease('bounce')
                .attr('y', function (d) {
                    return yScale(d.data);
                })
                .attr('height', function (d) {
                    return yScale(0) - yScale(d.data);
                });
        };

    }

    /**
     * 设置数据
     * @param dataset
     */
    ProfitChart.prototype.setData = function (dataset) {
        this.animate(dataset);
    };

    JHSSChart.ProfitChart = ProfitChart;

    /**
     * 收益曲线
     * @param containerNode
     * @param option
     * @constructor
     */
    function ProfitLineChart(containerNode, option) {
        BaseChart.call(this, containerNode);
        var svg = this.svg;

        if (!option) {
            option = {};
        }

        var color = option.color || ['#FF9641', 'rgba(253,137,24 ,0.4)', 'rgba(255,173,0,0.3)', 'rgba(207,144,0,0.2)'];

        var data = [];

        //缩放比例
        var xScale = d3.scale.linear()
            .range([0, this.size.width]);

        var yAssetScale = d3.scale.linear()
            .range([this.size.height, 0]);

        var yIndexScale = d3.scale.linear()
            .range([this.size.height, 0]);

        //收益曲线参数
        var lineAsset = d3.svg.line()
            .x(function (d, i) {
                return xScale(i);
            })
            .y(function (d) {
                return yAssetScale(d.asset);
            });

        var areaAsset = d3.svg.area()
            .x(function (d, i) {
                return xScale(i);
            })
            .y0(function () {
                return yAssetScale(0);
            })
            .y1(function (d) {
                return yAssetScale(d.asset);
            });

        //指数曲线参数
        var lineIndex = d3.svg.line()
            .x(function (d, i) {
                return xScale(i);
            })
            .y(function (d) {
                return yIndexScale(d.index);
            });

        var areaIndex = d3.svg.area()
            .x(function (d, i) {
                return xScale(i);
            })
            .y0(function () {
                return yAssetScale(0);
            })
            .y1(function (d) {
                return yIndexScale(d.index);
            });

        var doAnimate = function (obj) {
            obj.path.transition()
                .duration(JHSSChart.duration)
                .attrTween('d', function () {
                    var i = d3.interpolateRound(1, data.length);
                    return function (t) {
                        return obj.cal(data.slice(0, i(t)));
                    };
                });
        };

        var animateObjs = [];

        var assetLinePath = svg.append('path')
            .attr('fill', 'transparent')
            .attr('stroke-width', 1.5)
            .attr('stroke', color[0]);
        animateObjs.push({
            path: assetLinePath,
            cal: lineAsset
        });

        var assetAreaPath = svg.append('path')
            .attr('stroke', 'transparent')
            .attr('fill', color[1]);
        animateObjs.push({
            path: assetAreaPath,
            cal: areaAsset
        });

        var indexLinePath = svg.append('path')
            .attr('fill', 'transparent')
            .attr('stroke-width', 1.5)
            .attr('stroke', color[2]);
        animateObjs.push({
            path: indexLinePath,
            cal: lineIndex
        });

        var indexAreaPath = svg.append('path')
            .attr('stroke', 'transparent')
            .attr('fill', color[3]);
        animateObjs.push({
            path: indexAreaPath,
            cal: areaIndex
        });

        this.animate = function (dataset) {
            data = dataset.reverse();

            xScale.domain([0, data.length - 1]);

            yAssetScale.domain(d3.extent(data, function (d) {
                return d.asset;
            }));

            yIndexScale.domain(d3.extent(data, function (d) {
                return d.index;
            }));

            animateObjs.forEach(function (d) {
                doAnimate(d);
            });
        };
    }

    /**
     * 设置数据
     * @param dataset
     */
    ProfitLineChart.prototype.setData = function (dataset) {
        this.animate(dataset.slice(0));
    };

    JHSSChart.ProfitLineChart = ProfitLineChart;

    /**
     * 回撤曲线图
     * @param containerNode
     * @param option
     * @constructor
     */
    function BackAssetCLineChart(containerNode, option) {
        BaseChart.call(this, containerNode);
        var svg = this.svg;

        if (!option) {
            option = {};
        }

        var color = option.color = ['#60D3A1', 'rgba(203,241,222,0.7)'];

        var xScale = d3.scale.linear()
            .range([0, this.size.width]);

        var yScale = d3.scale.linear()
            .range([this.size.height, 0]);

        var animateObjs = [];

        var line = d3.svg.line()
            .x(function (d, i) {
                return xScale(i);
            })
            .y(function (d) {
                return yScale(d.backVal);
            });

        var area = d3.svg.area()
            .x(function (d, i) {
                return xScale(i);
            })
            .y0(function () {
                return yScale(0);
            })
            .y1(function (d) {
                return yScale(d.backVal);
            });

        var doAnimate = function (obj) {
            obj.path.transition()
                .duration(JHSSChart.duration)
                .attrTween('d', function () {
                    var i = d3.interpolateRound(1, data.length);
                    return function (t) {
                        return obj.cal(data.slice(0, i(t)));
                    };
                });
        };

        var areaPath = svg.append('path')
            .attr('fill', color[1]);

        animateObjs.push({
            path: areaPath,
            cal: area
        });

        var linePath = svg.append('path')
            .attr('fill', 'transparent')
            .attr('stroke', color[0])
            .attr('stroke-width', '2');

        animateObjs.push({
            path: linePath,
            cal: line
        });

        var data = option.data || [];

        this.animate = function (dataset) {
            data = dataset.reverse();
            xScale.domain([0, data.length]);
            yScale.domain(d3.extent(data, function (d) {
                return d.backVal;
            }));

            animateObjs.forEach(function (d) {
                doAnimate(d);
            });
        };
    }

    /**
     * 设置数据
     * @param dataset
     */
    BackAssetCLineChart.prototype.setData = function (dataset) {
        this.animate(dataset);
    };

    JHSSChart.BackAssetCLineChart = BackAssetCLineChart;

    /**
     * 总体收益图
     * @param containerNode
     * @param option
     * @constructor
     */
    function ProfitTotalChart(containerNode, option) {
        BaseChart.call(this, containerNode);
        var margin = {top: 0, right: 0, bottom: 50, left: 0};
        var svg = this.svg;
        var π = Math.PI;
        var xAxisPadding = 0.2;

        option = option || {};

        var color = option.color || ['#FF837C', '#1AAFEB', '#60D3A1'];
        var label = option.label || ['累计盈利', '净盈利', '累计亏损'];
        var data = option.data || [0, 0, 0];
        var xAxisScale = d3.scale.ordinal()
            .domain(label)
            .rangeRoundBands([0, this.size.width], xAxisPadding);

        var arcs = [];
        for (var i = 0; i < label.length; i++) {
            var arc = d3.svg.arc()
                .innerRadius(xAxisScale.rangeBand() / 2 + this.size.width * xAxisPadding * i * 2 / 5)
                .outerRadius(xAxisScale.rangeBand() / 2 + this.size.width * xAxisPadding * (i * 2 + 1) / 5)
                .startAngle(Math.pow(-1, (i + 1)) * π / 2);
            arcs.push(arc);
        }

        var line = d3.svg.line().interpolate('step-before')
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });

        var points = [];
        points.push([{
            x: this.size.width / 2 - xAxisScale.rangeBand() / 2 - this.size.width * xAxisPadding * 3.5 / 5,
            y: this.size.height - margin.bottom
        }, {
            x: this.size.width / 2 - xAxisScale.rangeBand() / 2 - this.size.width * xAxisPadding * 3 / 5,
            y: this.size.height - margin.bottom - margin.bottom / 5 - margin.bottom / 2
        }]);

        points.push([{
            x: this.size.width / 2 + xAxisScale.rangeBand() / 2 + this.size.width * xAxisPadding * 0.5 / 5,
            y: this.size.height - margin.bottom - margin.bottom / 5
        }, {
            x: this.size.width / 2 + xAxisScale.rangeBand() / 2,
            y: this.size.height - margin.bottom / 2
        }]);

        points.push([{
            x: this.size.width / 2 + xAxisScale.rangeBand() / 2 + this.size.width * xAxisPadding * 5.5 / 5,
            y: this.size.height - margin.bottom
        }, {
            x: this.size.width / 2 + xAxisScale.rangeBand() / 2 + this.size.width * xAxisPadding * 5 / 5,
            y: this.size.height - margin.bottom - margin.bottom / 5 - margin.bottom / 2
        }]);

        this.bindData = function (data) {
            var dataObjs = [];
            for (var i = 0; i < label.length; i++) {

                dataObjs.push({label: label[i], data: data[i]});
            }
            return dataObjs;
        };

        data = this.bindData(data);

        var container = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g');

        container.append('rect')
            .attr('x', function (d) {
                return xAxisScale(d.label);
            })
            .attr('y', this.size.height - margin.bottom)
            .attr('width', xAxisScale.rangeBand())
            .attr('height', margin.bottom)
            .attr('fill', function (d, i) {
                return color[i];
            });

        var arcPaths = container.append('path')
            .attr('transform', 'translate(' + this.size.width / 2 + ',' + (this.size.height - margin.bottom * 6 / 5) + ')')
            .attr('fill', function (d, i) {
                switch (i) {
                    case 0:
                        return color[1];
                    case 1:
                        return color[0];
                    case 2:
                        return color[2];
                    default :
                        return '#000';
                }
            });

        container.append('path')
            .attr('d', function (d, i) {
                return line(points[i]);
            })
            .attr('fill', 'transparent')
            .attr('stroke', function (d, i) {
                return color[i];
            })
            .attr('stroke-width', 2);

        container.append('text')
            .attr('x', function (d) {
                return xAxisScale(d.label) + xAxisScale.rangeBand() / 2;
            })
            .attr('y', this.size.height - margin.bottom / 2 - 4)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .text(function (d) {
                return d.label;
            });

        var profit = container.append('text')
            .data(data)
            .attr('x', function (d) {
                return xAxisScale(d.label) + xAxisScale.rangeBand() / 2;
            })
            .attr('y', this.size.height - margin.bottom / 2 + 4)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'text-before-edge')
            .attr('fill', '#fff')
            .text(function (d) {
                return '￥' + d.data;
            });

        this.animate = function (dataset) {
            data = this.bindData(dataset);
            arcPaths.transition()
                .duration(JHSSChart.duration)
                .attrTween('d', function (d, i) {
                    var inter = d3.interpolate(arcs[i].startAngle()(), Math.pow(-1, (i)) * π / 2);
                    return function (t) {
                        return arcs[i].endAngle(inter(t))();
                    };
                });

            profit.data(data).transition()
                .duration(JHSSChart.duration)
                .tween('text', function (d) {
                    var i = d3.interpolate(0, d.data);
                    return function (t) {
                        this.textContent = ('￥' + i(t).toFixed(0));
                    };
                });
        };
    }

    /**
     * 设置数据
     * @param dataset
     */
    ProfitTotalChart.prototype.setData = function (dataset) {
        this.animate(dataset);
    };

    JHSSChart.ProfitTotalChart = ProfitTotalChart;

    function ProfitAvgChart(containerNode, option) {
        BaseChart.call(this, containerNode);
        var margin = {top: 0, right: 0, bottom: 50, left: 0};
        var svg = this.svg,
            size = this.size,
            edge = this.edge;

        option = option || {};

        var color = option.color || ['#FF837C', '#1AAFEB', '#60D3A1'];
        var label = option.label || ['盈利日日均盈利', '日均盈亏', '亏损日日均亏损'];
        var data = option.data || [0, 0, 0];
        var rotate = [0, -90, 90];

        var containers = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('fill', function (d, i) {
                return color[i];
            })
            .attr('transform', function (d, i) {
                return 'rotate(' + rotate[i] + ',' + size.width / 2 + ',' + size.height / 2 + ')';
            });

        var cx = size.width / 2,
            cy = size.height / 2 - edge / 4,
            r = edge / 7;
        containers.append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', r);

        var triangle = d3.svg.line()
            .interpolate('linear')
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });

        var θ = Math.PI * 0.29;
        var points = [
            {x: cx - Math.sin(θ) * r, y: cy + Math.cos(θ) * r},
            {x: cx, y: cy + 1.5 * r},
            {x: cx + Math.sin(θ) * r, y: cy + Math.cos(θ) * r}
        ];

        console.log(points);
        containers.append('path')
            .attr('d', triangle(points));

    }

    ProfitAvgChart.prototype.setData = function (dataset) {
    };

    JHSSChart.ProfitAvgChart = ProfitAvgChart;

    /**
     * 仪表盘
     * @param containerNode
     * @param option
     * @constructor
     */
    function DashChart(containerNode, option) {
        BaseChart.call(this, containerNode);
        option = option || {};

        var colors = option.colors || ['#732928', '#FFBAB8', '#FFA6A4', '#E14949', '#F96360'];
        //['#2B6299', '#81D4F9', '#7FD5F9', '#2C6297', '#00A4F8'],
        //['#8E4D17', '#FFD8B7', '#FFC08E', '#D27327', '#FF8E32']


        var angleStart = -120,
            angleEnd = 120;

        var svg = this.svg,
            width = this.size.width,
            height = this.size.height,
            edge = this.edge;

        var scale = d3.scale.linear()
            .domain([0, 100])
            .range([angleStart, angleEnd]);

        var scaleData = d3.range(101);

        var scalesGroup = svg.append('g')
            .attr('transform', $.format('translate({0}, {1})', width / 2, 0));

        var scales = scalesGroup
            .selectAll('g')
            .data(scaleData)
            .enter()
            .append('g')
            .attr('transform', function (d) {
                return $.format('rotate({0}, {1}, {2})', scale(d), 0, height / 2);
            });

        scales.append('line')
            .attr('x1', 0)
            .attr('y1', function (d) {
                return d % 10 === 0 ? 0 : 0;
            })
            .attr('x2', 0)
            .attr('y2', function (d) {
                return d % 10 === 0 ? 16 : 16;
            })
            .attr('stroke-width', function (d) {
                return d % 10 === 0 ? 2 : 1;
            })
            .attr('stroke', function (d) {
                return d % 10 === 0 ? colors[0] : colors[1];
            });

        scales.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', 30)
            .attr('font-size', 12)
            .attr('fill', colors[0])
            .text(function (d) {
                return d % 10 === 0 ? d : '';
            });

        var pointContainer = svg.append('g')
            .attr('transform', $.format('translate({0}, {1})', width / 2, 0));

        pointContainer.append('circle')
            .attr('cx', 0)
            .attr('cy', height / 2)
            .attr('r', edge * 0.18)
            .attr('fill', colors[2]);

        var pointer = pointContainer.append('polygon')
            .attr('points', [-3, height / 2, 3, height / 2, 0, edge / 2 - edge * 0.38].join())
            .attr('fill', colors[3])
            .attr('transform', $.format('rotate({0}, {1}, {2})', scale(0), 0, height / 2));

        pointContainer.append('circle')
            .attr('cx', 0)
            .attr('cy', height / 2)
            .attr('r', edge * 0.13)
            .attr('fill', colors[4]);

        var pointerText = pointContainer.append('text')
            .attr('x', 0)
            .attr('y', height / 2)
            .attr('fill', '#fff')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', edge * 0.07)
            .text('0%');

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2 + edge * 0.3)
            .attr('font-size', edge * 0.08)
            .attr('text-anchor', 'middle')
            .attr('fill', colors[2])
            .text('总成功率');

        this.animate = function (dataset) {
            var startTransform = pointer.attr('transform'),
                endTransform = $.format('rotate({0}, {1}, {2})', scale(dataset), 0, height / 2);
            pointer.transition()
                .duration(JHSSChart.duration)
                .attrTween("transform", function () {
                    return d3.interpolateString(startTransform, endTransform);
                });

            pointerText.transition()
                .duration(JHSSChart.duration)
                .tween('text', function () {
                    var i = d3.interpolateNumber(0, dataset);
                    return function (t) {
                        var c = i(t);
                        this.textContent = c.toFixed(2) + '%';
                    };
                });

        };
    }

    /**
     * 设置数据
     * @param dataset
     */
    DashChart.prototype.setData = function (dataset) {
        this.animate(dataset);
    };

    JHSSChart.DashChart = DashChart;

    $.chart = JHSSChart;
})(jQuery, d3);