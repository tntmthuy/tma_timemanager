package com.timesphere.timesphere.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentChartPoint {
    private String date;
    private long count;
    private double totalAmount;
}