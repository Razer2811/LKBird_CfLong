package com.lkbird.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Lấy Authorization header
        String authHeader = request.getHeader("Authorization");

        // 2. Không có Bearer Token → cho request đi tiếp
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Lấy token bỏ chữ "Bearer "
        String token = authHeader.substring(7);

        try {
            // 4. Lấy username từ JWT
            String username = jwtService.extractUsername(token);

            // 5. Chỉ authenticate nếu SecurityContext chưa có user
            if (username != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                // 6. Lấy thông tin user từ database
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                // 7. Kiểm tra JWT hợp lệ + chưa hết hạn
                if (jwtService.validateToken(token, userDetails)) {

                    // 8. Tạo Authentication
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // 9. Đưa Authentication vào SecurityContext
                    SecurityContextHolder.getContext()
                            .setAuthentication(authenticationToken);
                }
            }

        } catch (Exception e) {
            // JWT không hợp lệ / hết hạn
            SecurityContextHolder.clearContext();
        }

        // 10. Cho request đi tiếp — CHỈ MỘT LẦN
        filterChain.doFilter(request, response);
    }
}