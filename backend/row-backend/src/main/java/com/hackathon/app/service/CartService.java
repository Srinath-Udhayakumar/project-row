package com.hackathon.app.service;

import com.hackathon.app.dto.request.AddCartItemRequest;
import com.hackathon.app.dto.response.CartItemResponse;
import com.hackathon.app.dto.response.CartResponse;
import com.hackathon.app.entity.Cart;
import com.hackathon.app.entity.CartItem;
import com.hackathon.app.entity.Product;
import com.hackathon.app.entity.User;
import com.hackathon.app.exception.BadRequestException;
import com.hackathon.app.exception.ResourceNotFoundException;
import com.hackathon.app.repository.CartItemRepository;
import com.hackathon.app.repository.CartRepository;
import com.hackathon.app.repository.ProductRepository;
import com.hackathon.app.repository.UserRepository;
import com.hackathon.app.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional
    public CartResponse addCartItem(AddCartItemRequest request) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity exceeds stock");
        }

        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElseGet(() -> CartItem.builder()
                        .cart(cart)
                        .product(product)
                        .quantity(0)
                        .build());

        int updatedQty = cartItem.getQuantity() + request.getQuantity();
        if (updatedQty > product.getStock()) {
            throw new BadRequestException("Total quantity in cart exceeds stock");
        }

        cartItem.setQuantity(updatedQty);
        cartItemRepository.save(cartItem);

        return getCurrentCart();
    }

    public CartResponse getCurrentCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        return toResponse(cart);
    }

    @Transactional
    public void removeCartItem(Long cartItemId) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to current user");
        }

        cartItemRepository.delete(item);
    }

    private User getCurrentUser() {
        String email = SecurityUtil.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> {
                    BigDecimal lineTotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    return CartItemResponse.builder()
                            .id(item.getId())
                            .productId(item.getProduct().getId())
                            .productName(item.getProduct().getName())
                            .price(item.getProduct().getPrice())
                            .quantity(item.getQuantity())
                            .lineTotal(lineTotal)
                            .build();
                })
                .toList();

        BigDecimal total = itemResponses.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(itemResponses)
                .totalAmount(total)
                .build();
    }
}