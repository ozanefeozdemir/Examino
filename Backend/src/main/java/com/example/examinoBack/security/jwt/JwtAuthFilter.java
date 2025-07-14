package com.example.examinoBack.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 1. Authorization header'ını al
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Header null ise veya "Bearer " ile başlamıyorsa filtreyi geç
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Token'ı "Bearer " kelimesinden sonra al
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt); // JWT içinden kullanıcı e-postasını al

        // 4. Eğer kullanıcı sistemde oturum açmamışsa ve token geçerliyse:
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 5. Kullanıcı bilgilerini yükle
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            // 6. Token geçerliyse kullanıcıyı güvenli şekilde bağla
            if (jwtService.isTokenValid(jwt, userDetails)) {

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 7. Kullanıcıyı güvenlik context'ine kaydet (yetkilendirme için)
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 8. Devam et
        filterChain.doFilter(request, response);
    }
}