// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RiskAnalysis {
    struct RiskReport {
        uint256 riskScore;
        string riskCategory;
        string attackType;
        string priority;
        bool shouldAlertUser;
        string[] summary;
    }

    // Map each report to an ID
    mapping(uint256 => RiskReport) public reports;
    uint256 public nextReportId = 1;

    // Event emitted when a report is stored
    event ReportStored(uint256 reportId);

    // Store a new risk report
    function storeReport(
        uint256 riskScore,
        string memory riskCategory,
        string memory attackType,
        string memory priority,
        bool shouldAlertUser,
        string[] memory summary
    ) public returns (uint256) {
        uint256 reportId = nextReportId;
        reports[reportId] = RiskReport({
            riskScore: riskScore,
            riskCategory: riskCategory,
            attackType: attackType,
            priority: priority,
            shouldAlertUser: shouldAlertUser,
            summary: summary
        });
        nextReportId++;
        emit ReportStored(reportId);
        return reportId;
    }

    // Retrieve a risk report
    function getReport(uint256 reportId) public view returns (
        uint256 riskScore,
        string memory riskCategory,
        string memory attackType,
        string memory priority,
        bool shouldAlertUser,
        string[] memory summary
    ) {
        RiskReport storage report = reports[reportId];
        return (
            report.riskScore,
            report.riskCategory,
            report.attackType,
            report.priority,
            report.shouldAlertUser,
            report.summary
        );
    }
}
